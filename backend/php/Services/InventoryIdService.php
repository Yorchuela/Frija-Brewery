<?php
declare(strict_types=1);

namespace Apicore\Services;

use Apicore\Core\Database;
use PDO;
use RuntimeException;

final class InventoryIdService
{
    private PDO $pdo;

    public function __construct()
    {
        $this->pdo = Database::newConnection();
    }

    public function next(string $sequenceName = 'inventory'): int
    {
        try {
            $this->pdo->beginTransaction();

            $statement = $this->pdo->prepare(
                'UPDATE inventory_id_sequence
                 SET current_value = current_value + 1
                 WHERE sequence_name = ?'
            );

            $statement->execute([$sequenceName]);

            if ($statement->rowCount() !== 1) {
                throw new RuntimeException(
                    'Inventory ID sequence could not be updated'
                );
            }

            $select = $this->pdo->prepare(
                'SELECT current_value
                 FROM inventory_id_sequence
                 WHERE sequence_name = ?'
            );

            $select->execute([$sequenceName]);

            $id = (int) $select->fetchColumn();

            if ($id <= 0) {
                throw new RuntimeException(
                    'Invalid inventory ID generated'
                );
            }

            $this->pdo->commit();

            return $id;
        } catch (\Throwable $error) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }

            throw $error;
        }
    }
}
