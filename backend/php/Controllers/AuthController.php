<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Core\RateLimiter;
use Apicore\Core\Security;
use Apicore\Core\Settings;
use Apicore\Core\UnauthorizedError;
use Apicore\Models\User;
use Apicore\Models\UserToken;
use Apicore\Services\TokenService;
use ValueError;

final class AuthController extends BaseController
{
    protected const MODEL_CLASS = User::class;

    private static ?RateLimiter $limiter = null;
    private static ?string $dummyHash = null;

    public function login(array $data): array
    {
        $username = $data['Username'] ?? null;
        $password = $data['Password'] ?? null;

        if (!$username || !$password) {
            throw new ValueError('Username and Password are required');
        }

        if (!is_string($username) || !is_string($password)) {
            throw new ValueError('Username and Password must be strings');
        }

        $persistent = $data['Persistent'] ?? false;

        if (!is_bool($persistent)) {
            throw new ValueError('Persistent must be a boolean');
        }

        $key = strtolower($username);
        $limiter = self::limiter();
        $limiter->check($key);

        // FRIJA utiliza email como identificador.
        $user = $this->model->findByUsername($username);

        if (
            $user === null
            || $user['status'] !== 'ACTIVE'
            || !Security::verifyPassword(
                $password,
                (string) $user['password']
            )
        ) {
            if ($user === null) {
                Security::verifyPassword($password, self::dummyHash());
            }

            $limiter->fail($key);
            throw new UnauthorizedError('Invalid credentials');
        }

        $limiter->reset($key);

        $settings = Settings::instance();
        $tokens = new UserToken();

        try {
            $tokens->deleteExpired();

            [$token, $payload] = TokenService::generateToken(
                (int) $user['user_id'],
                (string) $user['role'],
                $settings->TOKEN_LIFETIME_MINUTES,
                $settings->TOKEN_MIN_REMAINING_MINUTES,
                $persistent,
                $tokens,
            );
        } finally {
            $tokens->close();
        }

        return TokenService::buildTokenResponse($token, $payload);
    }

    public function logout(): void
    {
        TokenService::revokeToken((string) $this->authToken);
    }

    private static function limiter(): RateLimiter
    {
        return self::$limiter ??= new RateLimiter();
    }

    private static function dummyHash(): string
    {
        return self::$dummyHash ??= Security::hashPassword('timing-equalizer');
    }
}
