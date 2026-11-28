<?php
declare(strict_types=1);

namespace Apicore\Tests;

use Apicore\Controllers\UserController;
use Apicore\Core\ForbiddenError;
use Apicore\Models\BaseModel;
use ReflectionClass;
use ReflectionProperty;
use RuntimeException;
use Throwable;

final class UserControllerTest extends TestCase
{
    private function controller(
        array $target,
        int $activeAdmins = 1
    ): TestableUserController {
        $controller = (new ReflectionClass(TestableUserController::class))
            ->newInstanceWithoutConstructor();

        $model = new UserModelDouble($target, $activeAdmins);

        $property = new ReflectionProperty(
            \Apicore\Controllers\BaseController::class,
            'model'
        );

        $property->setValue($controller, $model);

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

    public function testPatchCommitsSuccessfulTransaction(): void
    {
        $controller = $this->controller($this->admin(), 2);

        $result = $controller->patch(3, [
            'status' => 'ACTIVE',
        ]);

        $model = $this->modelOf($controller);

        $this->assertSame(BaseModel::UPDATED, $result);
        $this->assertSame(1, $model->beginCount);
        $this->assertSame(1, $model->commitCount);
        $this->assertSame(0, $model->rollbackCount);
        $this->assertSame(1, $model->updateCount);
        $this->assertSame(
            ['lock_active_admins', 'target_for_update'],
            $model->lockOrder
        );
    }

    public function testPatchRollsBackWhenLastAdminWouldBeSuspended(): void
    {
        $controller = $this->controller($this->admin(), 1);

        $this->assertThrows(
            ForbiddenError::class,
            fn () => $controller->patch(3, [
                'status' => 'SUSPENDED',
            ])
        );

        $model = $this->modelOf($controller);

        $this->assertSame(1, $model->beginCount);
        $this->assertSame(0, $model->commitCount);
        $this->assertSame(1, $model->rollbackCount);
        $this->assertSame(0, $model->updateCount);
    }

    public function testDeleteCommitsAndRevokesUserTokens(): void
    {
        $controller = $this->controller($this->admin(), 2);

        $result = $controller->delete(3);

        $model = $this->modelOf($controller);

        $this->assertTrue($result);
        $this->assertSame(1, $controller->tokenRevocationCount);
        $this->assertSame(1, $model->deleteCount);
        $this->assertSame(1, $model->beginCount);
        $this->assertSame(1, $model->commitCount);
        $this->assertSame(0, $model->rollbackCount);
    }

    public function testDeleteRollsBackWhenTokenRevocationFails(): void
    {
        $controller = $this->controller($this->admin(), 2);
        $controller->failTokenRevocation = true;

        $this->assertThrows(
            RuntimeException::class,
            fn () => $controller->delete(3)
        );

        $model = $this->modelOf($controller);

        $this->assertSame(1, $controller->tokenRevocationCount);
        $this->assertSame(0, $model->deleteCount);
        $this->assertSame(1, $model->beginCount);
        $this->assertSame(0, $model->commitCount);
        $this->assertSame(1, $model->rollbackCount);
    }

    public function testDeleteRollsBackWhenUserDeletionFails(): void
    {
        $controller = $this->controller($this->admin(), 2);
        $model = $this->modelOf($controller);
        $model->failDelete = true;

        $this->assertThrows(
            RuntimeException::class,
            fn () => $controller->delete(3)
        );

        $this->assertSame(1, $controller->tokenRevocationCount);
        $this->assertSame(1, $model->deleteCount);
        $this->assertSame(1, $model->beginCount);
        $this->assertSame(0, $model->commitCount);
        $this->assertSame(1, $model->rollbackCount);
    }

    private function modelOf(UserController $controller): UserModelDouble
    {
        $property = new ReflectionProperty(
            \Apicore\Controllers\BaseController::class,
            'model'
        );

        $model = $property->getValue($controller);

        if (!$model instanceof UserModelDouble) {
            throw new \LogicException('Unexpected test model');
        }

        return $model;
    }
}

/**
 * Test controller that replaces the real token revocation operation.
 */
final class TestableUserController extends UserController
{
    public int $tokenRevocationCount = 0;
    public bool $failTokenRevocation = false;

    protected function revokeUserTokens(int|string $recordId): void
    {
        $this->tokenRevocationCount++;

        if ($this->failTokenRevocation) {
            throw new RuntimeException('Token revocation failed');
        }
    }
}

/**
 * Simulates the User model without connecting to MariaDB.
 */
final class UserModelDouble extends BaseModel
{
    protected const TABLE_NAME = 'users';
    protected const ID_COLUMN = 'user_id';

    public int $beginCount = 0;
    public int $commitCount = 0;
    public int $rollbackCount = 0;
    public int $updateCount = 0;
    public int $deleteCount = 0;

    public bool $failDelete = false;

    /** @var list<string> */
    public array $lockOrder = [];

    public function __construct(
        private array $target,
        private int $activeAdmins
    ) {
        // No se conecta a MariaDB.
    }

    public function transaction(callable $operation): mixed
    {
        $this->beginCount++;

        try {
            $result = $operation();
            $this->commitCount++;

            return $result;
        } catch (Throwable $error) {
            $this->rollbackCount++;
            throw $error;
        }
    }

    public function update(int|string $recordId, array $data): string
    {
        $this->updateCount++;

        return (string) $recordId === (string) $this->target['user_id']
            ? self::UPDATED
            : self::NOT_FOUND;
    }

    public function delete(int|string $recordId): bool
    {
        $this->deleteCount++;

        if ($this->failDelete) {
            throw new RuntimeException('User deletion failed');
        }

        return (string) $recordId === (string) $this->target['user_id'];
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

    public function lockActiveAdmins(): array
    {
        $this->lockOrder[] = 'lock_active_admins';

        if ($this->activeAdmins <= 0) {
            return [];
        }

        return array_map(
            static fn (int $id): string => (string) $id,
            range(1, $this->activeAdmins)
        );
    }

    public function getByIdForUpdate(int|string $id): ?array
    {
        $this->lockOrder[] = 'target_for_update';

        return (string) $id === (string) $this->target['user_id']
            ? $this->target
            : null;
    }
}
