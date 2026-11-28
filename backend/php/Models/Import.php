<?php
declare(strict_types=1);

namespace Apicore\Models;

use PDOException;
use ValueError;

final class Import extends BaseModel
{
    protected const TABLE_NAME = 'imports';
    protected const ID_COLUMN = 'import_id';

    protected const COLUMNS = [
        'supplier_id',
        'branch_id',
        'import_date',
        'document_number',
        'status',
    ];

    /**
     * Register an import and its details atomically.
     */
    public function createWithDetails(array $data): int
    {
        $details = $data['details'];
        unset($data['details']);

        // Acquire product locks in a consistent order.
        usort(
            $details,
            static fn (array $a, array $b): int =>
                (int) $a['product_id'] <=> (int) $b['product_id']
        );

        $data['status'] ??= 'PENDING';

        try {
            $this->pdo->beginTransaction();

            $supplierCheck = $this->pdo->prepare(
                'SELECT status FROM suppliers WHERE supplier_id = ? FOR UPDATE'
            );
            $supplierCheck->execute([$data['supplier_id']]);
            $supplier = $supplierCheck->fetch();

            if ($supplier === false || $supplier['status'] !== 'ACTIVE') {
                throw new ValueError('Supplier is not active or does not exist');
            }

            $branchCheck = $this->pdo->prepare(
                'SELECT status FROM branches WHERE branch_id = ? FOR UPDATE'
            );
            $branchCheck->execute([$data['branch_id']]);
            $branch = $branchCheck->fetch();

            if ($branch === false || $branch['status'] !== 'ACTIVE') {
                throw new ValueError('Branch is not active or does not exist');
            }

            $importId = parent::create($data);

            $detailStatement = $this->pdo->prepare(
                'INSERT INTO import_details
                    (import_id, product_id, quantity, unit_cost)
                 VALUES (?, ?, ?, ?)'
            );

            $productCheck = $this->pdo->prepare(
                'SELECT status FROM products WHERE product_id = ? FOR UPDATE'
            );

            foreach ($details as $detail) {
                $productCheck->execute([$detail['product_id']]);
                $product = $productCheck->fetch();

                if ($product === false || $product['status'] !== 'ACTIVE') {
                    throw new ValueError(
                        'Product ' . $detail['product_id'] . ' is not active or does not exist'
                    );
                }

                $detailStatement->execute([
                    $importId,
                    $detail['product_id'],
                    $detail['quantity'],
                    $detail['unit_cost'],
                ]);
            }

            $this->pdo->commit();

            return $importId;
        } catch (\Throwable $error) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            if (
                $error instanceof PDOException
                && (
                    $error->getCode() === '23000'
                    || ($error->errorInfo[1] ?? null) === 1062
                )
            ) {
                throw new ValueError('Import or import detail already exists');
            }

            throw $error;
        }
    }


    /**
     * Receive an import and update inventory.
     */
    public function receiveImport(int|string $recordId): string
    {
        try {
            $this->pdo->beginTransaction();

            $importCheck = $this->pdo->prepare(
                'SELECT import_id, branch_id, status
                 FROM imports
                 WHERE import_id = ?
                 FOR UPDATE'
            );

            $importCheck->execute([$recordId]);
            $import = $importCheck->fetch();

            if ($import === false) {
                $this->pdo->rollBack();
                return self::NOT_FOUND;
            }

            if ($import['branch_id'] === null) {
                throw new ValueError(
                    'Import has no destination branch assigned'
                );
            }

            if ($import['status'] !== 'IN_TRANSIT') {
                throw new ValueError(
                    'Only imports in transit can be received'
                );
            }

            $branchId = (int) $import['branch_id'];

            // Validate and lock the destination branch.
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
                    'Destination branch is not active or does not exist'
                );
            }

            $detailsStatement = $this->pdo->prepare(
                'SELECT product_id, quantity
                 FROM import_details
                 WHERE import_id = ?
                 ORDER BY product_id
                 FOR UPDATE'
            );

            $detailsStatement->execute([$recordId]);
            $details = $detailsStatement->fetchAll();

            if ($details === []) {
                throw new ValueError(
                    'Import has no details to receive'
                );
            }

            $productCheck = $this->pdo->prepare(
                'SELECT status
                 FROM products
                 WHERE product_id = ?
                 FOR UPDATE'
            );

            // Validate every product before modifying inventory.
            foreach ($details as $detail) {
                $productId = (int) $detail['product_id'];
                $quantity = (int) $detail['quantity'];

                if ($quantity <= 0) {
                    throw new ValueError(
                        'Import quantities must be greater than zero'
                    );
                }

                $productCheck->execute([$productId]);
                $product = $productCheck->fetch();

                if ($product === false || $product['status'] !== 'ACTIVE') {
                    throw new ValueError(
                        "Product $productId is not active or does not exist"
                    );
                }
            }

            $inventoryCheck = $this->pdo->prepare(
                'SELECT inventory_id, stock
                 FROM inventory_distributed
                 WHERE branch_id = ? AND product_id = ?
                 FOR UPDATE'
            );

            $insertInventory = $this->pdo->prepare(
                'INSERT INTO inventory_distributed
                    (inventory_id, branch_id, product_id, stock)
                 VALUES (?, ?, ?, ?)'
            );

            $updateInventory = $this->pdo->prepare(
                'UPDATE inventory_distributed
                 SET stock = ?
                 WHERE inventory_id = ? AND branch_id = ?'
            );

            $insertMovement = $this->pdo->prepare(
                'INSERT INTO inventory_movements
                    (branch_id, product_id, type, quantity, reason)
                 VALUES (?, ?, ?, ?, ?)'
            );

            $idService = null;

            foreach ($details as $detail) {
                $productId = (int) $detail['product_id'];
                $quantity = (int) $detail['quantity'];

                $inventoryCheck->execute([$branchId, $productId]);
                $inventory = $inventoryCheck->fetch();

                if ($inventory === false) {
                    // Create the ID service only when a new row is needed.
                    $idService ??= new \Apicore\Services\InventoryIdService();

                    $inventoryId = $idService->next();

                    $insertInventory->execute([
                        $inventoryId,
                        $branchId,
                        $productId,
                        $quantity,
                    ]);
                } else {
                    $inventoryId = (int) $inventory['inventory_id'];
                    $newStock = (int) $inventory['stock'] + $quantity;

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

                $insertMovement->execute([
                    $branchId,
                    $productId,
                    'IN',
                    $quantity,
                    'Import #' . $recordId . ' received',
                ]);
            }

            $updateImport = $this->pdo->prepare(
                "UPDATE imports
                 SET status = 'RECEIVED'
                 WHERE import_id = ?"
            );

            $updateImport->execute([$recordId]);

            $this->pdo->commit();

            return self::UPDATED;
        } catch (\Throwable $error) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $error;
        }
    }



    /**
     * Return one import with its detail lines.
     */
    public function getById(int|string $recordId): ?array
    {
        $import = parent::getById($recordId);

        if ($import === null) {
            return null;
        }

        $statement = $this->pdo->prepare(
            'SELECT
                import_detail_id,
                product_id,
                quantity,
                unit_cost
             FROM import_details
             WHERE import_id = ?
             ORDER BY import_detail_id'
        );

        $statement->execute([$recordId]);

        $import['details'] = $statement->fetchAll();

        return $import;
    }

    /**
     * Imports cannot be physically deleted through this API.
     */
    public function delete(int|string $recordId): bool
    {
        throw new ValueError('Imports cannot be deleted');
    }
}
