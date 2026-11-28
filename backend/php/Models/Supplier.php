<?php
declare(strict_types=1);

namespace Apicore\Models;

final class Supplier extends BaseModel
{
    protected const TABLE_NAME = 'suppliers';
    protected const ID_COLUMN = 'supplier_id';

    protected const COLUMNS = [
        'company_name',
        'contact',
        'phone',
        'email',
        'country',
        'status',
    ];

    public function delete(int|string $recordId): bool
    {
        return $this->update($recordId, [
            'status' => 'INACTIVE',
        ]) !== self::NOT_FOUND;
    }
}
