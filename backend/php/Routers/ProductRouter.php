<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Controllers\ProductController;
use Apicore\Core\Router;

final class ProductRouter
{
    public static function register(Router $router): void
    {
        $router->addCrudRoutes('/products', ProductController::class, 'Product');
    }
}
