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
     * Receive an import and update inventory atomically.
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

            if ($import['status'] === 'RECEIVED') {
                throw new ValueError('Import has already been received');
            }

            if ($import['status'] === 'CANCELLED') {
                throw new ValueError('Cancelled imports cannot be received');
            }

            if (!in_array($import['status'], ['PENDING', 'IN_TRANSIT'], true)) {
                throw new ValueError('Invalid import status for reception');
            }

            $detailsStatement = $this->pdo->prepare(
                'SELECT product_id, quantity
                 FROM import_details
                 WHERE import_id = ?
                 ORDER BY import_detail_id'
            );
            $detailsStatement->execute([$recordId]);
            $details = $detailsStatement->fetchAll();

            if ($details === []) {
                throw new ValueError('Import has no details to receive');
            }

            $ensureInventory = $this->pdo->prepare(
                'INSERT INTO inventory (branch_id, product_id, stock)
                 VALUES (?, ?, 0)
                 ON DUPLICATE KEY UPDATE inventory_id = inventory_id'
            );

            $inventoryCheck = $this->pdo->prepare(
                'SELECT inventory_id, stock
                 FROM inventory
                 WHERE branch_id = ? AND product_id = ?
                 FOR UPDATE'
            );

            $updateInventory = $this->pdo->prepare(
                'UPDATE inventory
                 SET stock = ?
                 WHERE inventory_id = ?'
            );

            $insertMovement = $this->pdo->prepare(
                'INSERT INTO inventory_movements
                    (branch_id, product_id, type, quantity, reason)
                 VALUES (?, ?, ?, ?, ?)'
            );

            foreach ($details as $detail) {
                $branchId = (int) $import['branch_id'];
                $productId = (int) $detail['product_id'];
                $quantity = (int) $detail['quantity'];

                $ensureInventory->execute([
                    $branchId,
                    $productId,
                ]);

                $inventoryCheck->execute([
                    $branchId,
                    $productId,
                ]);
                $inventory = $inventoryCheck->fetch();

                if ($inventory === false) {
                    throw new \RuntimeException(
                        'Inventory record could not be created'
                    );
                }

                $newStock = (int) $inventory['stock'] + $quantity;

                $updateInventory->execute([
                    $newStock,
                    $inventory['inventory_id'],
                ]);

                $insertMovement->execute([
                    $branchId,
                    $productId,
                    'IN',
                    $quantity,
                    'Import #' . $recordId . ' received',
                ]);
            }

            $updateImport = $this->pdo->prepare(
                "UPDATE imports SET status = 'RECEIVED' WHERE import_id = ?"
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
