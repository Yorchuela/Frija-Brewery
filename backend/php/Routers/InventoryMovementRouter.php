<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Controllers\InventoryMovementController;
use Apicore\Core\Response;
use Apicore\Core\Router;
use ValueError;

final class InventoryMovementRouter
{
    public static function register(Router $router): void
    {
        // Consultar historial de movimientos
        $router->addRoute(
            'GET',
            '/inventory-movements',
            InventoryMovementController::class,
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

        // Consultar movimiento por ID
        $router->addRoute(
            'GET',
            '/inventory-movements/{id}',
            InventoryMovementController::class,
            static function ($controller, array $params, string $body): Response {
                $id = filter_var($params['id'], FILTER_VALIDATE_INT);

                if ($id === false || $id < 1) {
                    throw new ValueError('Invalid movement ID');
                }

                $movement = $controller->getById($id);

                if ($movement === null) {
                    return Response::error(404, 'Movement not found');
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $movement,
                ]);
            },
        );

        // Registrar movimiento y actualizar existencias
        $router->addRoute(
            'POST',
            '/inventory-movements',
            InventoryMovementController::class,
            static function ($controller, array $params, string $body): Response {
                $movementId = $controller->registerMovement(
                    Router::jsonObject($body)
                );

                return new Response(201, [
                    'status' => 'ok',
                    'message' => 'Inventory movement registered',
                    'ID' => $movementId,
                ]);
            },
        );
    }
}
