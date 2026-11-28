<?php
declare(strict_types=1);

namespace Apicore\Models;

use RuntimeException;
use ValueError;

final class InventoryMovement extends BaseModel
{
    protected const TABLE_NAME = 'inventory_movements';
    protected const ID_COLUMN = 'movement_id';

    protected const COLUMNS = [
        'branch_id',
        'product_id',
        'type',
        'quantity',
        'reason',
    ];

    public function register(array $data): int
    {
        $this->pdo->beginTransaction();

        try {
            $productCheck = $this->pdo->prepare( 'SELECT status FROM products WHERE product_id = ? FOR UPDATE')
            ;

             $productCheck->execute([$data['product_id']]);
             $product = $productCheck->fetch();

            if ($product === false || $product['status'] !== 'ACTIVE') {
             throw new ValueError('Product is not active or does not exist');
            }




            // Verify that the branch exists and is active.
            $branchCheck = $this->pdo->prepare(
                'SELECT status FROM branches WHERE branch_id = ? FOR UPDATE'
            );

            $branchCheck->execute([$data['branch_id']]);
            $branch = $branchCheck->fetch();

            if ($branch === false || $branch['status'] !== 'ACTIVE') {
                throw new ValueError('Branch is not active or does not exist');
            }

            // Ensure the inventory row exists and serialize concurrent access.
            $ensureInventory = $this->pdo->prepare(
                'INSERT INTO inventory (branch_id, product_id, stock)
                 VALUES (?, ?, 0)
                 ON DUPLICATE KEY UPDATE inventory_id = inventory_id'
            );

            $ensureInventory->execute([
                $data['branch_id'],
                $data['product_id'],
            ]);

            // Lock the inventory row before calculating the new stock.
            $statement = $this->pdo->prepare(
                'SELECT inventory_id, stock
                 FROM inventory
                 WHERE branch_id = ? AND product_id = ?
                 FOR UPDATE'
            );

            $statement->execute([
                $data['branch_id'],
                $data['product_id'],
            ]);

            $inventory = $statement->fetch();

            if ($inventory === false) {
                throw new RuntimeException('Inventory record could not be created');
            }

            $currentStock = (int) $inventory['stock'];
            $quantity = (int) $data['quantity'];

            $newStock = match ($data['type']) {
                'IN' => $currentStock + $quantity,
                'OUT' => $currentStock - $quantity,
                'ADJUSTMENT' => $quantity,
                default => throw new ValueError('Invalid movement type'),
            };

            if ($newStock < 0) {
                throw new ValueError('Insufficient stock');
            }

            // Update inventory.
            $updateInventory = $this->pdo->prepare(
                'UPDATE inventory
                 SET stock = ?
                 WHERE inventory_id = ?'
            );

            $updateInventory->execute([
                $newStock,
                $inventory['inventory_id'],
            ]);

            // Save the movement in the same transaction.
            $insertMovement = $this->pdo->prepare(
                'INSERT INTO inventory_movements
                    (branch_id, product_id, type, quantity, reason)
                 VALUES (?, ?, ?, ?, ?)'
            );

            $insertMovement->execute([
                $data['branch_id'],
                $data['product_id'],
                $data['type'],
                $quantity,
                $data['reason'] ?? null,
            ]);

            $movementId = (int) $this->pdo->lastInsertId();

            $this->pdo->commit();

            return $movementId;
        } catch (\Throwable $error) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $error;
        }
        
    }

    public function delete(int|string $recordId): bool
    {
        throw new ValueError('Inventory movements cannot be deleted');
    }

    public function update(int|string $recordId, array $data): string
    {
        throw new ValueError('Inventory movements cannot be modified');
    }
}
