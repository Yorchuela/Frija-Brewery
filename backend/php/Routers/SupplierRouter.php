<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Controllers\SupplierController;
use Apicore\Core\Router;

final class SupplierRouter
{
    public static function register(Router $router): void
    {
        $router->addCrudRoutes('/suppliers', SupplierController::class, 'Supplier');
    }
}
