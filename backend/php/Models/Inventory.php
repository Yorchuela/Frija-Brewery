<?php
declare(strict_types=1);

namespace Apicore\Models;

final class Inventory extends BaseModel
{
    protected const TABLE_NAME = 'inventory_distributed';
    protected const ID_COLUMN = 'inventory_id';

    protected const COLUMNS = [
        'branch_id',
        'product_id',
        'stock',
        'minimum_stock',
    ];

    /**
     * Return inventory for a specific branch and product.
     */
    public function getByBranchAndProduct(
        int $branchId,
        int $productId
    ): ?array {
        $statement = $this->pdo->prepare(
            'SELECT *
             FROM inventory_distributed
             WHERE branch_id = ? AND product_id = ?'
        );

        $statement->execute([$branchId, $productId]);
        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    /**
     * Return all inventory records for a branch.
     */
    public function getByBranch(int $branchId): array
    {
        $statement = $this->pdo->prepare(
            'SELECT *
             FROM inventory_distributed
             WHERE branch_id = ?
             ORDER BY product_id'
        );

        $statement->execute([$branchId]);

        return $statement->fetchAll();
    }

    /**
     * Inventory records cannot be created through generic CRUD.
     * Distributed writes require dedicated operations.
     */
    public function create(array $data): int
    {
        throw new \ValueError(
            'Inventory creation requires a dedicated distributed operation'
        );
    }

    /**
     * Inventory records cannot be updated through generic CRUD.
     */
    public function update(int|string $recordId, array $data): string
    {
        throw new \ValueError(
            'Inventory updates require a dedicated distributed operation'
        );
    }

    /**
     * Inventory records cannot be deleted through generic CRUD.
     */
    public function delete(int|string $recordId): bool
    {
        throw new \ValueError(
            'Inventory records cannot be deleted through this API'
        );
    }

    public function getByBranchAndId(
    int $branchId,
    int $inventoryId
): ?array {
    $statement = $this->pdo->prepare(
        'SELECT *
         FROM inventory_distributed
         WHERE branch_id = ? AND inventory_id = ?'
    );

    $statement->execute([$branchId, $inventoryId]);
    $row = $statement->fetch();

    return $row === false ? null : $row;
}
}
