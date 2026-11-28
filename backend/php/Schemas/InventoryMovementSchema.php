<?php
declare(strict_types=1);

namespace Apicore\Schemas;

final class InventoryMovementSchema
{
    public const TYPES = ['IN', 'OUT', 'ADJUSTMENT'];

    public static function validate(array $data, bool $partial = false): void
    {
        BaseSchema::validateInteger($data, 'branch_id', minimum: 1, required: !$partial, partial: $partial);
        BaseSchema::validateInteger($data, 'product_id', minimum: 1, required: !$partial, partial: $partial);
        BaseSchema::validateEnum($data, 'type', self::TYPES, $partial);

        if (isset($data['quantity']) && ($data['type'] ?? null) === 'ADJUSTMENT') {
            BaseSchema::validateInteger($data, 'quantity', minimum: 0, required: !$partial, partial: $partial);
        } else {
            BaseSchema::validateInteger($data, 'quantity', minimum: 1, required: !$partial, partial: $partial);
        }

        BaseSchema::validateString($data, 'reason', 100, partial: $partial);
    }
}
