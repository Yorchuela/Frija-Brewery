<?php
declare(strict_types=1);

namespace Apicore\Models;

final class User extends BaseModel
{
    protected const TABLE_NAME = 'users';
    protected const ID_COLUMN = 'user_id';

    protected const COLUMNS = [
        'first_name',
        'paternal_last_name',
        'maternal_last_name',
        'email',
        'phone',
        'password',
        'role',
        'branch_id',
        'status',
    ];

    protected const HIDDEN_COLUMNS = ['password'];

    /**
     * Busca un usuario mediante su correo electrónico.
     * Incluye password para verificar las credenciales.
     */
    public function findByUsername(string $username): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT * FROM ' . static::TABLE_NAME . ' WHERE email = ?'
        );

        $statement->execute([$username]);

        $row = $statement->fetch();

        return $row === false ? null : $row;
    }

    public function countByRole(string $role): int
    {
        $statement = $this->pdo->prepare(
            'SELECT COUNT(*) FROM ' . static::TABLE_NAME . ' WHERE role = ?'
        );

        $statement->execute([$role]);

        return (int) $statement->fetchColumn();
    }
        /**
     * Cuenta únicamente los usuarios activos de un rol específico.
     */
    public function countActiveByRole(string $role): int
    {
        $statement = $this->pdo->prepare(
            'SELECT COUNT(*) FROM ' . static::TABLE_NAME
            . ' WHERE role = ? AND status = ?'
        );

        $statement->execute([$role, 'ACTIVE']);

        return (int) $statement->fetchColumn();
    }

    /**
     * Lock all active administrators in a consistent order.
     * Locks remain held until the surrounding transaction finishes.
     *
     * @return list<string>
     */
    public function lockActiveAdmins(): array
    {
        $statement = $this->pdo->prepare(
            'SELECT user_id FROM ' . static::TABLE_NAME
            . ' WHERE role = ? AND status = ?'
            . ' ORDER BY user_id FOR UPDATE'
        );

        $statement->execute(['ADMIN', 'ACTIVE']);

        return array_map(
            static fn (array $row): string => (string) $row['user_id'],
            $statement->fetchAll()
        );
    }

    /**
     * Read and lock a user record for an update or deletion.
     */
    public function getByIdForUpdate(int|string $recordId): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT * FROM ' . static::TABLE_NAME
            . ' WHERE ' . static::ID_COLUMN . ' = ? FOR UPDATE'
        );

        $statement->execute([$recordId]);
        $row = $statement->fetch();

        return $this->publicRow($row === false ? null : $row);
    }
}
