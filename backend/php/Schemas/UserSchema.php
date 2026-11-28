<?php
declare(strict_types=1);

namespace Apicore\Schemas;

use ValueError;

final class UserSchema
{
    public const ROLES = [
        'ADMIN',
        'MANAGER',
        'SALES',
        'INVENTORY',
        'CUSTOMER',
    ];

    public const STATUSES = [
        'ACTIVE',
        'SUSPENDED',
        'BLOCKED',
    ];

    public static function validate(array $data, bool $partial = false): void
    {
        // Required fields
        BaseSchema::validateString(
            $data,
            'first_name',
            50,
            required: true,
            partial: $partial
        );

        BaseSchema::validateString(
            $data,
            'paternal_last_name',
            50,
            required: true,
            partial: $partial
        );

        BaseSchema::validateString(
            $data,
            'email',
            100,
            required: true,
            partial: $partial
        );

        BaseSchema::validateString(
            $data,
            'password',
            255,
            required: true,
            partial: $partial
        );

        // Optional fields
        BaseSchema::validateString(
            $data,
            'maternal_last_name',
            50,
            partial: $partial
        );

        BaseSchema::validateString(
            $data,
            'phone',
            15,
            partial: $partial
        );

        BaseSchema::validateInteger(
            $data,
            'branch_id',
            minimum: 1,
            partial: $partial
        );

        // Email format
        if (array_key_exists('email', $data)) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                throw new ValueError('email must be a valid email address');
            }
        }

        // Password length
        if (array_key_exists('password', $data)) {
            if (strlen($data['password']) < 8) {
                throw new ValueError('password must be at least 8 characters');
            }
        }

        // Enum fields are optional because the database has defaults
        if (array_key_exists('role', $data)) {
            BaseSchema::validateEnum($data, 'role', self::ROLES);
        }

        if (array_key_exists('status', $data)) {
            BaseSchema::validateEnum($data, 'status', self::STATUSES);
        }
    }
}
