<?php
declare(strict_types=1);

namespace Apicore\Schemas;

use ValueError;

final class ImportSchema
{
    public const STATUSES = [
        'PENDING',
        'IN_TRANSIT',
        'RECEIVED',
        'CANCELLED',
    ];

    public static function validate(array $data, bool $partial = false): void
    {
        BaseSchema::validateInteger(
            $data,
            'supplier_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        // Destination branch is required for new imports.
        BaseSchema::validateInteger(
            $data,
            'branch_id',
            minimum: 1,
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateDate(
            $data,
            'import_date',
            required: !$partial,
            partial: $partial,
        );

        BaseSchema::validateString(
            $data,
            'document_number',
            30,
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

        if (!$partial && !array_key_exists('details', $data)) {
            throw new ValueError('details is required');
        }

        if (array_key_exists('details', $data)) {
            self::validateDetails($data['details']);
        }
    }

    private static function validateDetails(mixed $details): void
    {
        if (
            !is_array($details)
            || !array_is_list($details)
            || $details === []
        ) {
            throw new ValueError('details must be a non-empty array');
        }

        $productIds = [];

        foreach ($details as $index => $detail) {
            if (!is_array($detail)) {
                throw new ValueError("details[$index] must be an object");
            }

            $unknown = array_diff(
                array_keys($detail),
                ['product_id', 'quantity', 'unit_cost'],
            );

            if ($unknown !== []) {
                throw new ValueError(
                    "Unknown field(s) in details[$index]: "
                    . implode(', ', $unknown)
                );
            }

            BaseSchema::validateInteger(
                $detail,
                'product_id',
                minimum: 1,
                required: true,
            );

            BaseSchema::validateInteger(
                $detail,
                'quantity',
                minimum: 1,
                required: true,
            );

            BaseSchema::validateNumber(
                $detail,
                'unit_cost',
                minimum: 0,
                required: true,
            );

            if (in_array($detail['product_id'], $productIds, true)) {
                throw new ValueError(
                    'A product cannot appear more than once in details'
                );
            }

            $productIds[] = $detail['product_id'];
        }
    }

    public static function validateStatusTransition(
        string $currentStatus,
        string $newStatus,
    ): void {
        $allowedTransitions = [
            'PENDING' => ['IN_TRANSIT', 'CANCELLED'],
            'IN_TRANSIT' => ['RECEIVED', 'CANCELLED'],
            'RECEIVED' => [],
            'CANCELLED' => [],
        ];

        if (
            $currentStatus !== $newStatus
            && !in_array(
                $newStatus,
                $allowedTransitions[$currentStatus] ?? [],
                true
            )
        ) {
            throw new ValueError(
                "Invalid import status transition: $currentStatus to $newStatus"
            );
        }
    }
}
