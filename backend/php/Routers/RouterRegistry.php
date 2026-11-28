<?php
declare(strict_types=1);

namespace Apicore\Routers;

use Apicore\Core\Router;
use RuntimeException;

final class RouterRegistry
{
    public static function registerAll(Router $router): void
    {
        $files = glob(__DIR__ . '/*Router.php') ?: [];
        sort($files);

        foreach ($files as $file) {
            // Skip the registry itself.
            if (basename($file) === 'RouterRegistry.php') {
                continue;
            }

            $class = __NAMESPACE__ . '\\' . basename($file, '.php');

            if (!is_callable([$class, 'register'])) {
                throw new RuntimeException(
                    $class . ' must define register(Router $router)'
                );
            }

            $class::register($router);
        }
    }
}
