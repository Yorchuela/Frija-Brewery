<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Core\ForbiddenError;
use Apicore\Core\Security;
use Apicore\Models\User;
use Apicore\Models\UserToken;
use Apicore\Schemas\UserSchema;
use ValueError;

class UserController extends BaseController
{
    protected const MODEL_CLASS = User::class;
    protected const SCHEMA = UserSchema::class;

    private const PRIVILEGED_ROLES = ['ADMIN'];

    private function isPrivileged(): bool
    {
        return in_array(
            $this->authUser['role'] ?? null,
            self::PRIVILEGED_ROLES,
            true
        );
    }

    private function ownsRecord(int|string $recordId): bool
    {
        return (string) $recordId ===
            (string) ($this->authUser['sub'] ?? '');
    }

    /**
     * Only administrators can list users.
     */
    public function getAll(?int $page = null, ?int $size = null): array
    {
        if (!$this->isPrivileged()) {
            throw new ForbiddenError('Only ADMIN can list users');
        }

        return parent::getAll($page, $size);
    }

    /**
     * Users can read their own account.
     */
    public function getById(int|string $recordId): ?array
    {
        if (!$this->isPrivileged() && !$this->ownsRecord($recordId)) {
            throw new ForbiddenError('You can only read your own account');
        }

        return parent::getById($recordId);
    }

    /**
     * Run user updates inside a transaction.
     */
    public function update(int|string $recordId, array $data): string
    {
        return $this->runUserTransaction(
            fn (): string => parent::update($recordId, $data)
        );
    }

    /**
     * Run partial user updates inside a transaction.
     */
    public function patch(int|string $recordId, array $data): string
    {
        return $this->runUserTransaction(
            fn (): string => parent::patch($recordId, $data)
        );
    }

    /**
     * Run user deletion and token revocation atomically.
     */
    public function delete(int|string $recordId): bool
    {
        return $this->runUserTransaction(
            fn (): bool => parent::delete($recordId)
        );
    }

    private function runUserTransaction(callable $operation): mixed
    {
        if ($this->model === null) {
            throw new \LogicException('User model is not initialized');
        }

        return $this->model->transaction($operation);
    }

    /**
     * Protect user accounts and the last active administrator.
     */
    public function authorize(
        int|string $recordId,
        string $action,
        ?array $data = null
    ): void {
        if (!$this->isPrivileged() && !$this->ownsRecord($recordId)) {
            throw new ForbiddenError('You can only modify your own account');
        }

        // Lock active administrators first, always in the same order.
        // The surrounding transaction keeps these locks until the write ends.
        $activeAdmins = $this->model->lockActiveAdmins();

        // Also lock the target user before checking its current state.
        $target = $this->model->getByIdForUpdate($recordId);

        if ($target === null) {
            return;
        }

        $targetRole = $target['role'];

        // Only administrators can modify administrator accounts.
        if ($targetRole === 'ADMIN' && !$this->isPrivileged()) {
            throw new ForbiddenError('Only ADMIN can modify an administrator account');
        }

        // Protect the last active administrator.
        if (
            $targetRole === 'ADMIN'
            && ($target['status'] ?? null) === 'ACTIVE'
            && count($activeAdmins) <= 1
        ) {
            if ($action === 'delete') {
                throw new ForbiddenError(
                    'The last active ADMIN account cannot be deleted'
                );
            }

            if (($data['role'] ?? 'ADMIN') !== 'ADMIN') {
                throw new ForbiddenError(
                    'The last active ADMIN cannot lose its role'
                );
            }

            if (($data['status'] ?? 'ACTIVE') !== 'ACTIVE') {
                throw new ForbiddenError(
                    'The last active ADMIN cannot be suspended or blocked'
                );
            }
        }
    }

    /**
     * Revoke the user's tokens before deleting the account.
     */
    public function beforeDelete(int|string $recordId): void
    {
        $this->revokeUserTokens($recordId);
    }

    /**
     * Revoke all tokens associated with a user.
     * Protected to allow isolated testing without MariaDB.
     */
    protected function revokeUserTokens(int|string $recordId): void
    {
        $tokens = new UserToken();

        try {
            $tokens->deleteByUser($recordId);
        } finally {
            $tokens->close();
        }
    }

    /**
     * Prepare user data before saving.
     */
    public function prepare(
        array $data,
        int|string|null $recordId = null,
        bool $partial = false
    ): array {
        // Public registration always creates CUSTOMER accounts.
        if ($recordId === null) {
            if (!$this->isPrivileged()) {
                $data['role'] = 'CUSTOMER';
            } elseif (!array_key_exists('role', $data)) {
                $data['role'] = 'CUSTOMER';
            }
        }

        // Check duplicate email addresses.
        if (array_key_exists('email', $data)) {
            $existing = $this->model->findByUsername(
                (string) $data['email']
            );

            if (
                $existing !== null
                && (string) $existing['user_id'] !== (string) $recordId
            ) {
                throw new ValueError('Email already exists');
            }
        }

        $role = $data['role'] ?? null;

        // Only ADMIN can assign roles other than CUSTOMER.
        if (
            $role !== null
            && $role !== 'CUSTOMER'
            && !$this->isPrivileged()
        ) {
            throw new ForbiddenError('Only ADMIN can assign privileged roles');
        }

        // Only ADMIN can change account status.
        if (array_key_exists('status', $data) && !$this->isPrivileged()) {
            throw new ForbiddenError('Only ADMIN can change user status');
        }

        // Hash passwords before storing them.
        if (
            array_key_exists('password', $data)
            && $data['password'] !== null
            && !is_string($data['password'])
        ) {
            throw new ValueError('password must be a string');
        }

        if (!empty($data['password'])) {
            $data['password'] = Security::hashPassword($data['password']);
        } elseif ($recordId !== null) {
            // An omitted password during an update remains unchanged.
            unset($data['password']);
        }

        return $data;
    }
}
