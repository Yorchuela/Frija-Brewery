<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Models\Product;
use Apicore\Schemas\ProductSchema;

final class ProductController extends BaseController
{
    protected const MODEL_CLASS = Product::class;
    protected const SCHEMA = ProductSchema::class;
}
