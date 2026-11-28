<?php
declare(strict_types=1);

namespace Apicore\Schemas;

final class SupplierSchema
{
    public const STATUSES = [
        'ACTIVE',
        'INACTIVE',
        'SUSPENDED',
    ];

    public static function validate(array $data, bool $partial = false): void
    {
        BaseSchema::validateString(
            $data,
            'company_name',
            100,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'contact',
            100,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'phone',
            15,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'email',
            100,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'country',
            50,
            required: !$partial,
            partial: $partial,
        );

        if (array_key_exists('status', $data)) {
            BaseSchema::validateEnum(
                $data,
                'status',
                self::STATUSES,
                $partial,
            );
        }
    }
}
