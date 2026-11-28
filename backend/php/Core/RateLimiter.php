<?php
declare(strict_types=1);

namespace Apicore\Core;

use RuntimeException;

/**
 * File-based rate limiter.
 *
 * Attempts are stored in files so the limit is shared between PHP workers.
 */
final class RateLimiter
{
    private string $directory;

    public function __construct(
        private int $maxFailures = 5,
        private int $windowSeconds = 900,
        ?string $directory = null,
    ) {
        if ($this->maxFailures < 1) {
            throw new RuntimeException('Rate limiter maximum attempts must be positive');
        }

        if ($this->windowSeconds < 0) {
            throw new RuntimeException('Rate limiter window cannot be negative');
        }

        $this->directory = $directory ?? sys_get_temp_dir() . '/apicore_ratelimit';

        if (!is_dir($this->directory)
            && !@mkdir($this->directory, 0700, true)
            && !is_dir($this->directory)
        ) {
            throw new RuntimeException('Unable to create rate limiter directory');
        }

        if (!is_writable($this->directory)) {
            throw new RuntimeException('Rate limiter directory is not writable');
        }
    }

    /**
     * Atomically checks the limit and reserves an attempt.
     */
    public function attempt(string $key): void
    {
        $this->withLock($key, function (array $times): array {
            if (count($times) >= $this->maxFailures) {
                throw new TooManyRequestsError(
                    'Too many login attempts, try again later'
                );
            }

            $times[] = microtime(true);

            return $times;
        });
    }

    /** Throw TooManyRequestsError if the key is blocked. */
    public function check(string $key): void
    {
        $this->withLock($key, function (array $times): array {
            if (count($times) >= $this->maxFailures) {
                throw new TooManyRequestsError(
                    'Too many login attempts, try again later'
                );
            }

            return $times;
        });
    }

    /** Register a failed attempt. */
    public function fail(string $key): void
    {
        $this->withLock($key, function (array $times): array {
            $times[] = microtime(true);

            return $times;
        });
    }

    /** Clear the counter without unlinking the locked file. */
    public function reset(string $key): void
    {
        $this->withLock($key, static fn (array $times): array => []);
    }

    /**
     * Read, transform and rewrite the counter under an exclusive lock.
     *
     * @param callable(list<float>): list<float> $change
     */
    private function withLock(string $key, callable $change): void
    {
        $handle = @fopen($this->path($key), 'c+');

        if ($handle === false) {
            throw new RuntimeException('Unable to open rate limiter counter');
        }

        try {
            if (!@flock($handle, LOCK_EX)) {
                throw new RuntimeException('Unable to lock rate limiter counter');
            }

            rewind($handle);

            $raw = stream_get_contents($handle);

            if ($raw === false) {
                throw new RuntimeException('Unable to read rate limiter counter');
            }

            $times = $this->fresh($this->decode($raw));
            $updated = $change($times);

            $json = json_encode($updated);

            if ($json === false) {
                throw new RuntimeException('Unable to encode rate limiter counter');
            }

            if (!ftruncate($handle, 0)) {
                throw new RuntimeException('Unable to truncate rate limiter counter');
            }

            rewind($handle);

            $written = fwrite($handle, $json);

            if ($written !== strlen($json) || !fflush($handle)) {
                throw new RuntimeException('Unable to write rate limiter counter');
            }
        } finally {
            @flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /** @return list<float> */
    private function fresh(array $times): array
    {
        $limit = microtime(true) - $this->windowSeconds;

        return array_values(array_filter(
            $times,
            static fn (float $time): bool => $time > $limit,
        ));
    }

    /** @return list<float> */
    private function decode(string $raw): array
    {
        $decoded = json_decode($raw, true);

        if (!is_array($decoded)) {
            return [];
        }

        return array_values(array_filter(
            $decoded,
            static fn ($time): bool => is_numeric($time),
        ));
    }

    private function path(string $key): string
    {
        return $this->directory . '/' . hash('sha256', $key) . '.json';
    }
}
