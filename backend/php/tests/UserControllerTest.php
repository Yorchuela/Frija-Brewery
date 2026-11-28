<?php
declare(strict_types=1);

namespace Apicore\Tests;

use Apicore\Controllers\UserController;
use Apicore\Core\ForbiddenError;
use Apicore\Models\BaseModel;
use ReflectionClass;
use ReflectionProperty;

final class UserControllerTest extends TestCase
{
    private function controller(
        array $target,
        int $activeAdmins = 1
    ): UserController {
        $controller = (new ReflectionClass(UserController::class))
            ->newInstanceWithoutConstructor();

        $model = new UserModelDouble($target, $activeAdmins);

        $property = new ReflectionProperty(
            \Apicore\Controllers\BaseController::class,
            'model'
        );

        $property->setValue($controller, $model);

        // Simular una sesión autenticada como administrador.
        $controller->authUser = [
            'sub' => $target['user_id'],
            'role' => 'ADMIN',
        ];

        return $controller;
    }

    private function admin(
        int $id = 3,
        string $status = 'ACTIVE'
    ): array {
        return [
            'user_id' => $id,
            'role' => 'ADMIN',
            'status' => $status,
        ];
    }

    public function testLastActiveAdminCannotBeDeleted(): void
    {
        $controller = $this->controller($this->admin());

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->authorize(3, 'delete')
        );
    }

    public function testLastActiveAdminCannotBeSuspended(): void
    {
        $controller = $this->controller($this->admin());

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->authorize(3, 'update', [
                'status' => 'SUSPENDED',
            ])
        );
    }

    public function testLastActiveAdminCannotBeBlocked(): void
    {
        $controller = $this->controller($this->admin());

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->authorize(3, 'update', [
                'status' => 'BLOCKED',
            ])
        );
    }

    public function testLastActiveAdminCannotLoseAdminRole(): void
    {
        $controller = $this->controller($this->admin());

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->authorize(3, 'update', [
                'role' => 'MANAGER',
            ])
        );
    }

    public function testLastActiveAdminCanKeepItsAccountActive(): void
    {
        $controller = $this->controller($this->admin());

        $controller->authorize(3, 'update', [
            'status' => 'ACTIVE',
        ]);

        $this->assertTrue(true);
    }

    public function testAdminCanBeDeletedWhenAnotherActiveAdminExists(): void
    {
        $controller = $this->controller($this->admin(), 2);

        $controller->authorize(3, 'delete');

        $this->assertTrue(true);
    }

    public function testSuspendedAdminCanBeDeleted(): void
    {
        $controller = $this->controller(
            $this->admin(3, 'SUSPENDED'),
            1
        );

        $controller->authorize(3, 'delete');

        $this->assertTrue(true);
    }

    public function testNonAdminCannotModifyAdminAccount(): void
    {
        $controller = $this->controller($this->admin());

        $controller->authUser = [
            'sub' => 5,
            'role' => 'CUSTOMER',
        ];

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->authorize(3, 'delete')
        );
    }
}

/**
 * Simulates the User model without connecting to MariaDB.
 */
final class UserModelDouble extends BaseModel
{
    protected const TABLE_NAME = 'users';
    protected const ID_COLUMN = 'user_id';

    public function __construct(
        private array $target,
        private int $activeAdmins
    ) {
        // No se conecta a MariaDB.
    }

    public function getById(int|string $id): ?array
    {
        return (string) $id === (string) $this->target['user_id']
            ? $this->target
            : null;
    }

    public function countActiveByRole(string $role): int
    {
        return $role === 'ADMIN' ? $this->activeAdmins : 0;
    }
}
