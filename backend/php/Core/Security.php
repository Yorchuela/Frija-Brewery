<?php
declare(strict_types=1);

namespace Apicore\Core;

use ValueError;

/**
 * Security: password hashing and manual JWT (HS256) signing/verification.
 *
 * Layer: core (cross-cutting). Pure crypto and payload handling, no database
 * access here (token persistence lives in Services\TokenService).
 *
 * The formats match the Python API exactly, so a password hash or a token
 * created by one implementation is accepted by the other.
 */
final class Security
{
    public const HASH_ALGORITHM = 'pbkdf2_sha256';
    public const HASH_ITERATIONS = 100000;

    // --- Password hashing ---

    /** Return "algorithm$iterations$salt$hash" (self-contained, salt is random). */
    public static function hashPassword(string $password): string
    {
        $salt = bin2hex(random_bytes(16));

        $digest = hash_pbkdf2(
            'sha256',
            $password,
            hex2bin($salt),
            self::HASH_ITERATIONS,
            0,
            false
        );

        return self::HASH_ALGORITHM . '$'
            . self::HASH_ITERATIONS . '$'
            . $salt . '$' . $digest;
    }

    /**
     * Check a password against a stored hash in constant time.
     *
     * Supports bcrypt, current PBKDF2 and legacy PBKDF2 formats.
     */
    public static function verifyPassword(
        string $password,
        string $storedHash
    ): bool {
        // Compatibility with existing FRIJA bcrypt hashes.
        if (
            str_starts_with($storedHash, '$2a$')
            || str_starts_with($storedHash, '$2b$')
            || str_starts_with($storedHash, '$2y$')
        ) {
            return password_verify($password, $storedHash);
        }

        // Current APICore PBKDF2-SHA256 format.
        if (str_contains($storedHash, '$')) {
            $parts = explode('$', $storedHash);

            if (
                count($parts) !== 4
                || $parts[0] !== self::HASH_ALGORITHM
            ) {
                return false;
            }

            [, $iterations, $salt, $expected] = $parts;
        } else {
            // Legacy PBKDF2 format: salt:hash.
            $parts = explode(':', $storedHash);

            if (count($parts) !== 2) {
                return false;
            }

            [$salt, $expected] = $parts;
            $iterations = (string) self::HASH_ITERATIONS;
        }

        // Validate hash format and lengths.
        if (
            !ctype_digit($iterations)
            || !ctype_xdigit($salt)
            || strlen($salt) !== 32
            || !ctype_xdigit($expected)
            || strlen($expected) !== 64
        ) {
            return false;
        }

        $iterationCount = (int) $iterations;

        // Reject invalid or excessive iteration counts.
        if (
            $iterationCount < 1
            || $iterationCount > 1000000
        ) {
            return false;
        }

        $digest = hash_pbkdf2(
            'sha256',
            $password,
            hex2bin($salt),
            $iterationCount,
            0,
            false
        );

        return hash_equals($expected, $digest);
    }

    // --- Base64 URL encoding (JWT) ---

    public static function base64UrlEncode(string $data): string
    {
        return rtrim(
            strtr(base64_encode($data), '+/', '-_'),
            '='
        );
    }

    public static function base64UrlDecode(string $data): string
    {
        $padded = $data
            . str_repeat('=', (4 - strlen($data) % 4) % 4);

        $decoded = base64_decode(
            strtr($data, '-_', '+/'),
            true
        );

        if ($decoded === false) {
            throw new UnauthorizedError('Invalid token');
        }

        return $decoded;
    }

    // --- Tokens ---

    /** HMAC-SHA256 signature of "header.payload". */
    private static function sign(string $signingInput): string
    {
        $secret = Settings::instance()->JWT_SECRET;

        return self::base64UrlEncode(
            hash_hmac('sha256', $signingInput, $secret, true)
        );
    }

    /** SHA-256 of the raw token: this is what is stored and looked up in the DB. */
    public static function hashToken(string $token): string
    {
        return hash('sha256', $token);
    }

    /**
     * Claims of a new token. lifetimeMinutes is ignored when persistent=true
     * (no exp claim); minRemainingMinutes is only a claim for the client.
     *
     * @return array<string, mixed>
     */
    public static function generatePayload(
        int $userId,
        string $role,
        int $lifetimeMinutes,
        int $minRemainingMinutes,
        bool $persistent = false,
    ): array {
        $now = time();

        $payload = [
            'sub' => $userId,
            'role' => $role,
            'iat' => $now,
            'jti' => bin2hex(random_bytes(16)),
            'min_remaining_minutes' => $minRemainingMinutes,
        ];

        if (!$persistent) {
            $payload['exp'] = $now + $lifetimeMinutes * 60;
        }

        return $payload;
    }

    /**
     * Sign "header.payload" (HS256) and return the compact JWT.
     *
     * @param array<string, mixed> $payload
     */
    public static function encodeToken(array $payload): string
    {
        $header = [
            'alg' => Settings::instance()->JWT_ALGORITHM,
            'typ' => 'JWT',
        ];

        $signingInput = self::base64UrlEncode(self::jsonEncode($header))
            . '.'
            . self::base64UrlEncode(self::jsonEncode($payload));

        return $signingInput . '.' . self::sign($signingInput);
    }

    /**
     * Validate structure, algorithm, signature and expiration.
     *
     * Returns the payload. Throws UnauthorizedError on any failure.
     *
     * @return array<string, mixed>
     */
    public static function verifyToken(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new UnauthorizedError('Invalid token');
        }

        [$headerB64, $payloadB64, $signature] = $parts;

        $header = json_decode(
            self::base64UrlDecode($headerB64),
            true
        );

        $payload = json_decode(
            self::base64UrlDecode($payloadB64),
            true
        );

        if (!is_array($header) || !is_array($payload)) {
            throw new UnauthorizedError('Invalid token');
        }

        // Validate algorithm.
        if (
            ($header['alg'] ?? null)
            !== Settings::instance()->JWT_ALGORITHM
        ) {
            throw new UnauthorizedError('Invalid token');
        }

        // Validate signature.
        if (
            !hash_equals(
                self::sign($headerB64 . '.' . $payloadB64),
                $signature
            )
        ) {
            throw new UnauthorizedError('Invalid token');
        }

        // Validate required claims.
        if (
            !isset($payload['sub'])
            || !is_int($payload['sub'])
            || $payload['sub'] <= 0
            || !isset($payload['role'])
            || !is_string($payload['role'])
            || $payload['role'] === ''
        ) {
            throw new UnauthorizedError('Invalid token');
        }

        // Validate optional claims when present.
        if (
            array_key_exists('iat', $payload)
            && !is_int($payload['iat'])
        ) {
            throw new UnauthorizedError('Invalid token');
        }

        if (
            array_key_exists('jti', $payload)
            && !is_string($payload['jti'])
        ) {
            throw new UnauthorizedError('Invalid token');
        }

        // Validate expiration.
        if (array_key_exists('exp', $payload)) {
            if (!is_int($payload['exp'])) {
                throw new UnauthorizedError('Invalid token');
            }

            if ($payload['exp'] <= time()) {
                throw new UnauthorizedError('Token expired');
            }
        }

        return $payload;
    }

    /**
     * JSON without spaces, the same separators Python's json.dumps uses.
     *
     * @param array<string, mixed> $value
     */
    private static function jsonEncode(array $value): string
    {
        $encoded = json_encode(
            $value,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        if ($encoded === false) {
            throw new ValueError('Unable to encode token payload');
        }

        return $encoded;
    }
}
