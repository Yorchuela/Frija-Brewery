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
}
