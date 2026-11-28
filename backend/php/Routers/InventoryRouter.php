<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Controllers\InventoryController;
use Apicore\Core\Response;
use Apicore\Core\Router;
use ValueError;

final class InventoryRouter
{
    public static function register(Router $router): void
    {
        // Consultar inventario por sucursal
        $router->addRoute(
            'GET',
            '/inventory/branch/{id}',
            InventoryController::class,
            static function ($controller, array $params, string $body): Response {
                $branchId = filter_var($params['id'], FILTER_VALIDATE_INT);

                if ($branchId === false || $branchId < 1) {
                    throw new ValueError('Invalid branch ID');
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $controller->getByBranch($branchId),
                ]);
            },
        );

        // Consultar todo el inventario
        $router->addRoute(
            'GET',
            '/inventory',
            InventoryController::class,
            static function ($controller, array $params, string $body): Response {
                $query = $controller->query ?? [];
                $page = Router::positiveInt($query, 'page');
                $size = Router::positiveInt($query, 'size');

                if ($size > Router::MAX_PAGE_SIZE) {
                    throw new ValueError('Invalid page size');
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $controller->getAll(
                        $page ?: null,
                        $size ?: null
                    ),
                ]);
            },
        );

        // Consultar un registro por ID
        $router->addRoute(
            'GET',
            '/inventory/{id}',
            InventoryController::class,
            static function ($controller, array $params, string $body): Response {
                $id = filter_var($params['id'], FILTER_VALIDATE_INT);

                if ($id === false || $id < 1) {
                    throw new ValueError('Invalid inventory ID');
                }

                $inventory = $controller->getById($id);

                if ($inventory === null) {
                    return Response::error(404, 'Inventory not found');
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $inventory,
                ]);
            },
        );
    }
}
