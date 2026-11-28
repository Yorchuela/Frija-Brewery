<?php
declare(strict_types=1);

namespace Apicore\Core;

use DateTimeZone;
use Exception;
use ValueError;

final class Settings
{
    private const REQUIRED = [
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'JWT_SECRET'
    ];

    private const JWT_ALGORITHM = 'HS256';

    public string $APP_HOST;
    public int $APP_PORT;
    public string $APP_TIMEZONE;
    public string $DB_HOST;
    public int $DB_PORT;
    public string $DB_NAME;
    public string $DB_USER;
    public string $DB_PASSWORD;
    public string $JWT_SECRET;
    public string $JWT_ALGORITHM;
    public int $TOKEN_LIFETIME_MINUTES;
    public int $TOKEN_MIN_REMAINING_MINUTES;
    public string $CORS_ALLOW_ORIGIN;

    private static ?self $instance = null;

    public function __construct(?string $envPath = null)
    {
        $values = self::readEnvFile(
            $envPath ?? dirname(__DIR__) . '/.env'
        );

        $get = static function (
            string $key,
            ?string $default = null
        ) use ($values): ?string {
            $env = getenv($key);

            if ($env !== false) {
                return $env;
            }

            return $values[$key] ?? $default;
        };

        $this->APP_HOST = (string) $get('APP_HOST', 'localhost');
        $this->APP_PORT = self::integerSetting(
            'APP_PORT',
            $get('APP_PORT', '8000'),
            1,
            65535
        );

        $this->APP_TIMEZONE = (string) $get(
            'APP_TIMEZONE',
            'America/Tijuana'
        );

        try {
            new DateTimeZone($this->APP_TIMEZONE);
        } catch (Exception) {
            throw new ValueError(
                'APP_TIMEZONE is not a valid IANA timezone'
            );
        }

        $this->DB_HOST = (string) $get('DB_HOST', 'localhost');

        $this->DB_PORT = self::integerSetting(
            'DB_PORT',
            $get('DB_PORT', '3306'),
            1,
            65535
        );

        $this->DB_NAME = (string) $get('DB_NAME', '');
        $this->DB_USER = (string) $get('DB_USER', '');
        $this->DB_PASSWORD = (string) $get('DB_PASSWORD', '');
        $this->JWT_SECRET = (string) $get('JWT_SECRET', '');

        $algorithm = (string) $get('JWT_ALGORITHM', self::JWT_ALGORITHM);

        if ($algorithm !== self::JWT_ALGORITHM) {
            throw new ValueError(
                'Only HS256 is supported for JWT_ALGORITHM'
            );
        }

        $this->JWT_ALGORITHM = self::JWT_ALGORITHM;

        $this->TOKEN_LIFETIME_MINUTES = self::integerSetting(
            'TOKEN_LIFETIME_MINUTES',
            $get('TOKEN_LIFETIME_MINUTES', '60'),
            1,
            525600
        );

        $this->TOKEN_MIN_REMAINING_MINUTES = self::integerSetting(
            'TOKEN_MIN_REMAINING_MINUTES',
            $get('TOKEN_MIN_REMAINING_MINUTES', '10'),
            0,
            525599
        );

        if (
            $this->TOKEN_MIN_REMAINING_MINUTES
            >= $this->TOKEN_LIFETIME_MINUTES
        ) {
            throw new ValueError(
                'TOKEN_MIN_REMAINING_MINUTES must be lower than TOKEN_LIFETIME_MINUTES'
            );
        }

        $this->CORS_ALLOW_ORIGIN = (string) $get(
            'CORS_ALLOW_ORIGIN',
            '*'
        );
    }

    public static function instance(): self
    {
        return self::$instance ??= new self();
    }

    public function validate(): void
    {
        $missing = [];

        foreach (self::REQUIRED as $name) {
            if ($this->{$name} === '') {
                $missing[] = $name;
            }
        }

        if ($missing !== []) {
            throw new ValueError(
                'Missing required setting(s): ' . implode(', ', $missing)
            );
        }

        if (strlen($this->JWT_SECRET) < 32) {
            throw new ValueError(
                'JWT_SECRET must contain at least 32 bytes'
            );
        }
    }

    private static function integerSetting(
        string $name,
        ?string $value,
        int $minimum,
        int $maximum
    ): int {
        if (
            $value === null
            || filter_var($value, FILTER_VALIDATE_INT) === false
        ) {
            throw new ValueError(
                $name . ' must be a valid integer'
            );
        }

        $number = (int) $value;

        if ($number < $minimum || $number > $maximum) {
            throw new ValueError(
                $name . ' is outside the permitted range'
            );
        }

        return $number;
    }

    /**
     * @return array<string, string>
     */
    private static function readEnvFile(string $path): array
    {
        if (!is_file($path)) {
            return [];
        }

        $values = [];

        foreach (file($path, FILE_IGNORE_NEW_LINES) ?: [] as $line) {
            $line = trim($line);

            if (
                $line === ''
                || str_starts_with($line, '#')
                || !str_contains($line, '=')
            ) {
                continue;
            }

            [$key, $value] = explode('=', $line, 2);

            $values[trim($key)] = trim(trim($value), '"\'');
        }

        return $values;
    }
}
