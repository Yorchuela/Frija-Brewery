<?php
declare(strict_types=1);

namespace Apicore\Schemas;

final class ProductSchema
{
    public const STATUSES = [
        'ACTIVE',
        'INACTIVE',
        'DISCONTINUED',
    ];

    /**
     * Validate a product payload.
     *
     * @param array<string, mixed> $data
     */
    public static function validate(array $data, bool $partial = false): void
    {
        BaseSchema::validateString(
            $data,
            'name',
            100,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'brand_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'category_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'presentation',
            30,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'content_ml',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateNumber(
            $data,
            'alcohol_content',
            minimum: 0,
            maximum: 99.99,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateNumber(
            $data,
            'sale_price',
            minimum: 0,
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
