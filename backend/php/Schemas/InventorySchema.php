<?php
declare(strict_types=1);

namespace Apicore\Schemas;

final class InventorySchema
{
    public static function validate(array $data, bool $partial = false): void
    {
        BaseSchema::validateInteger(
            $data,
            'branch_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'product_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'stock',
            minimum: 0,
            required: false,
            partial: $partial,
        );

        BaseSchema::validateInteger(
            $data,
            'minimum_stock',
            minimum: 0,
            required: false,
            partial: $partial,
        );
    }
}
