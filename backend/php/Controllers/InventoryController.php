<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Models\Inventory;
use Apicore\Schemas\InventorySchema;

final class InventoryController extends BaseController
{
    protected const MODEL_CLASS = Inventory::class;
    protected const SCHEMA = InventorySchema::class;

    public function getByBranch(int $branchId): array
    {
        return $this->model->getByBranch($branchId);
    }
}
