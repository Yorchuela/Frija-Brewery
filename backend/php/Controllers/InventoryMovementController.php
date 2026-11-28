<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Models\InventoryMovement;
use Apicore\Schemas\InventoryMovementSchema;

final class InventoryMovementController extends BaseController
{
    protected const MODEL_CLASS = InventoryMovement::class;
    protected const SCHEMA = InventoryMovementSchema::class;

    public function registerMovement(array $data): int
    {
        $this->validate($data);

        return $this->model->register($data);
    }
}
