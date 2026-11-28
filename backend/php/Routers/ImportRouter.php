<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Controllers\ImportController;
use Apicore\Core\Router;
use Apicore\Core\Response;
use ValueError;

final class ImportRouter
{
    public static function register(Router $router): void
    {
        $path = '/imports';
        $item = $path . '/{id}';

        $router->addRoute(
            'GET',
            $path,
            ImportController::class,
            static function ($controller, array $params, string $body): Response {
                $query = $controller->query ?? [];
                $page = Router::positiveInt($query, 'page');
                $size = Router::positiveInt($query, 'size');

                if ($size > Router::MAX_PAGE_SIZE) {
                    throw new ValueError(
                        'size must be ' . Router::MAX_PAGE_SIZE . ' or less'
                    );
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $controller->getAll(
                        $page ?: null,
                        $size ?: null
                    ),
                ]);
            }
        );

        $router->addRoute(
            'GET',
            $item,
            ImportController::class,
            static function ($controller, array $params, string $body): Response {
                $import = $controller->getById($params['id']);

                if ($import === null) {
                    return Response::error(404, 'Import not found');
                }

                return new Response(200, [
                    'status' => 'ok',
                    'data' => $import,
                ]);
            }
        );

        $router->addRoute(
            'POST',
            $path,
            ImportController::class,
            static function ($controller, array $params, string $body) use ($path): Response {
                $recordId = $controller->create(
                    Router::jsonObject($body)
                );

                return new Response(
                    201,
                    [
                        'status' => 'ok',
                        'ID' => $recordId,
                    ],
                    ['Location' => $path . '/' . $recordId]
                );
            }
        );

        // PATCH only: import updates have specific business rules.
        $router->addRoute(
            'PATCH',
            $item,
            ImportController::class,
            static function ($controller, array $params, string $body): Response {
                $result = $controller->patch(
                    $params['id'],
                    Router::jsonObject($body)
                );

                if ($result === $controller::NOT_FOUND) {
                    return Response::error(404, 'Import not found');
                }

                if ($result === $controller::UNCHANGED) {
                    return new Response(200, [
                        'status' => 'ok',
                        'message' => 'No changes to apply',
                    ]);
                }

                if ($result === $controller::UPDATED) {
                    return new Response(200, [
                        'status' => 'ok',
                        'message' => 'Import updated',
                    ]);
                }

                throw new ValueError(
                    'Unexpected update result: ' . var_export($result, true)
                );
            }
        );
    }
}
