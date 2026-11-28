<?php
declare(strict_types=1);

namespace Apicore\Models;

final class Product extends BaseModel
{
    protected const TABLE_NAME = 'products';
    protected const ID_COLUMN = 'product_id';

    protected const COLUMNS = [
        'name',
        'brand_id',
        'category_id',
        'presentation',
        'content_ml',
        'alcohol_content',
        'sale_price',
        'status',
    ];

    private const DECIMAL_COLUMNS = [
        'alcohol_content',
        'sale_price',
    ];

    /**
     * Preserve decimal precision when returning product records.
     *
     * @param array<string, mixed>|null $row
     * @return array<string, mixed>|null
     */
    protected function publicRow(?array $row): ?array
    {
        $row = parent::publicRow($row);

        if ($row === null) {
            return null;
        }

        foreach (self::DECIMAL_COLUMNS as $column) {
            if (isset($row[$column])) {
                $row[$column] = (string) $row[$column];
            }
        }

        return $row;
    }

    /**
     * Perform a logical deletion instead of physically deleting the product.
     */
    public function delete(int|string $recordId): bool
    {
        return $this->update($recordId, [
            'status' => 'INACTIVE',
        ]) !== self::NOT_FOUND;
    }
}
