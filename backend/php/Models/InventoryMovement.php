<?php
declare(strict_types=1);

namespace Apicore\Models;

use Apicore\Services\InventoryIdService;
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
        $branchId = (int) $data['branch_id'];
        $productId = (int) $data['product_id'];
        $quantity = (int) $data['quantity'];
        $type = $data['type'];

        if (!in_array($type, ['IN', 'OUT', 'ADJUSTMENT'], true)) {
            throw new ValueError('Invalid movement type');
        }

        if (
            ($type === 'ADJUSTMENT' && $quantity < 0)
            || ($type !== 'ADJUSTMENT' && $quantity <= 0)
        ) {
            throw new ValueError('Invalid quantity for movement type');
        }

        try {
            $this->pdo->beginTransaction();

            // Validate and lock the branch first.
            $branchCheck = $this->pdo->prepare(
                'SELECT status
                 FROM branches
                 WHERE branch_id = ?
                 FOR UPDATE'
            );

            $branchCheck->execute([$branchId]);
            $branch = $branchCheck->fetch();

            if ($branch === false || $branch['status'] !== 'ACTIVE') {
                throw new ValueError(
                    'Branch is not active or does not exist'
                );
            }

            // Validate and lock the product.
            $productCheck = $this->pdo->prepare(
                'SELECT status
                 FROM products
                 WHERE product_id = ?
                 FOR UPDATE'
            );

            $productCheck->execute([$productId]);
            $product = $productCheck->fetch();

            if ($product === false || $product['status'] !== 'ACTIVE') {
                throw new ValueError(
                    'Product is not active or does not exist'
                );
            }

            // Find the distributed inventory record.
            $inventoryCheck = $this->pdo->prepare(
                'SELECT inventory_id, stock
                 FROM inventory_distributed
                 WHERE branch_id = ? AND product_id = ?
                 FOR UPDATE'
            );

            $inventoryCheck->execute([$branchId, $productId]);
            $inventory = $inventoryCheck->fetch();

            $inventoryExists = $inventory !== false;

            if ($inventoryExists) {
                $inventoryId = (int) $inventory['inventory_id'];
                $currentStock = (int) $inventory['stock'];
            } else {
                $inventoryId = null;
                $currentStock = 0;
            }

            // Calculate the resulting stock.
            $newStock = match ($type) {
                'IN' => $currentStock + $quantity,
                'OUT' => $currentStock - $quantity,
                'ADJUSTMENT' => $quantity,
            };

            if ($newStock < 0) {
                throw new ValueError('Insufficient stock');
            }

            // Create the distributed inventory record if necessary.
            if (!$inventoryExists) {
                $idService = new InventoryIdService();
                $inventoryId = $idService->next();

                $insertInventory = $this->pdo->prepare(
                    'INSERT INTO inventory_distributed
                        (inventory_id, branch_id, product_id, stock)
                     VALUES (?, ?, ?, ?)'
                );

                $insertInventory->execute([
                    $inventoryId,
                    $branchId,
                    $productId,
                    $newStock,
                ]);
            } elseif ($newStock !== $currentStock) {
                // Update only when the stock actually changes.
                $updateInventory = $this->pdo->prepare(
                    'UPDATE inventory_distributed
                     SET stock = ?
                     WHERE inventory_id = ? AND branch_id = ?'
                );

                $updateInventory->execute([
                    $newStock,
                    $inventoryId,
                    $branchId,
                ]);

                if ($updateInventory->rowCount() !== 1) {
                    throw new \RuntimeException(
                        'Distributed inventory could not be updated'
                    );
                }
            }

            // Register movement history locally.
            $insertMovement = $this->pdo->prepare(
                'INSERT INTO inventory_movements
                    (branch_id, product_id, type, quantity, reason)
                 VALUES (?, ?, ?, ?, ?)'
            );

            $insertMovement->execute([
                $branchId,
                $productId,
                $type,
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
