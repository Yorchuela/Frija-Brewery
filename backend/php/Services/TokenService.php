<?php
declare(strict_types=1);

namespace Apicore\Services;

use Apicore\Core\Security;
use Apicore\Core\Settings;
use Apicore\Core\UnauthorizedError;
use Apicore\Models\UserToken;
use DateTimeImmutable;
use DateTimeZone;

final class TokenService
{
    public const PERSISTENT_EXPIRATION = '9999-12-31 23:59:59';

    public static function generateToken(
        int $userId,
        string $role,
        int $lifetimeMinutes,
        int $minRemainingMinutes,
        bool $persistent = false,
        ?UserToken $tokenModel = null,
    ): array {
        $payload = Security::generatePayload(
            $userId,
            $role,
            $lifetimeMinutes,
            $minRemainingMinutes,
            $persistent
        );

        $token = Security::encodeToken($payload);

        $expiration = $persistent
            ? self::PERSISTENT_EXPIRATION
            : gmdate('Y-m-d H:i:s', (int) $payload['exp']);

        $model = $tokenModel ?? new UserToken();

        try {
            $model->create([
                'user_id' => $userId,
                'token_hash' => Security::hashToken($token),
                'token_expiration' => $expiration,
                'token_created_at' => gmdate('Y-m-d H:i:s'),
            ]);
        } finally {
            if ($tokenModel === null) {
                $model->close();
            }
        }

        return [$token, $payload];
    }

    public static function buildTokenResponse(
        string $token,
        array $payload
    ): array {
        $expiresAt = isset($payload['exp'])
            ? self::isoformatFromTimestamp((int) $payload['exp'])
            : null;

        return [
            'token' => $token,
            'token_type' => 'Bearer',
            'expires_at' => $expiresAt,
            'persistent' => !isset($payload['exp']),
            'min_remaining_minutes' => $payload['min_remaining_minutes'],
        ];
    }

    public static function decodeToken(string $token): array
    {
        $payload = Security::verifyToken($token);

        $model = new UserToken();

        try {
            $state = $model->getUserState(
                Security::hashToken($token)
            );
        } finally {
            $model->close();
        }

        if ($state === null) {
            throw new UnauthorizedError('Token revoked or unknown');
        }

        [$status, $role] = $state;

        if ($status !== 'ACTIVE') {
            throw new UnauthorizedError('User inactive or not found');
        }

        $payload['role'] = $role;

        return $payload;
    }

    public static function revokeToken(string $token): bool
    {
        $model = new UserToken();

        try {
            return $model->deleteByHash(
                Security::hashToken($token)
            ) > 0;
        } finally {
            $model->close();
        }
    }

    public static function isoformatFromTimestamp(int $epoch): string
    {
        $timezone = new DateTimeZone(
            Settings::instance()->APP_TIMEZONE
        );

        return (new DateTimeImmutable('@' . $epoch))
            ->setTimezone($timezone)
            ->format('Y-m-d\TH:i:sP');
    }
}
