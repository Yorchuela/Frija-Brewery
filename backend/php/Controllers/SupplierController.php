<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Models\Supplier;
use Apicore\Schemas\SupplierSchema;

final class SupplierController extends BaseController
{
    protected const MODEL_CLASS = Supplier::class;
    protected const SCHEMA = SupplierSchema::class;
}
