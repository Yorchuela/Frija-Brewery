<?php
declare(strict_types=1);

namespace Apicore\Models;

final class UserToken extends BaseModel
{
    protected const TABLE_NAME = 'users_tokens';
    protected const ID_COLUMN = 'token_id';

    protected const COLUMNS = [
        'user_id',
        'token_hash',
        'token_expiration',
        'token_created_at',
    ];

    private function deleteWhere(string $column, int|string $value): int
    {
        $statement = $this->pdo->prepare(
            'DELETE FROM ' . static::TABLE_NAME . " WHERE $column = ?"
        );

        $statement->execute([$value]);

        return $statement->rowCount();
    }

    public function getUserState(string $tokenHash): ?array
    {
        $statement = $this->pdo->prepare(
            'SELECT u.status, u.role
             FROM ' . static::TABLE_NAME . ' t
             JOIN users u ON u.user_id = t.user_id
             WHERE t.token_hash = ?
             AND t.token_expiration > UTC_TIMESTAMP()'
        );

        $statement->execute([$tokenHash]);
        $row = $statement->fetch();

        return $row === false
            ? null
            : [(string) $row['status'], (string) $row['role']];
    }

    public function deleteByHash(string $tokenHash): int
    {
        return $this->deleteWhere('token_hash', $tokenHash);
    }

    public function deleteExpired(): int
    {
        $statement = $this->pdo->query(
            'DELETE FROM ' . static::TABLE_NAME .
            ' WHERE token_expiration < UTC_TIMESTAMP()'
        );

        return $statement === false ? 0 : $statement->rowCount();
    }

    public function deleteByUser(int|string $userId): int
    {
        return $this->deleteWhere('user_id', $userId);
    }
}
