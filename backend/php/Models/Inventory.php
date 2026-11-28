<?php
declare(strict_types=1);

namespace Apicore\Models;

final class Inventory extends BaseModel
{
    protected const TABLE_NAME = 'inventory';
    protected const ID_COLUMN = 'inventory_id';

    protected const COLUMNS = [
        'branch_id',
        'product_id',
        'stock',
        'minimum_stock',
    ];

    public function getByBranchAndProduct(int $branchId, int $productId): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT * FROM inventory WHERE branch_id = ? AND product_id = ?'
        );
        $statement->execute([$branchId, $productId]);
        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    public function getByBranch(int $branchId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT * FROM inventory WHERE branch_id = ? ORDER BY product_id'
        );
        $statement->execute([$branchId]);

        return $statement->fetchAll();
    }
}
