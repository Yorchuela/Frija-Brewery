<?php
declare(strict_types=1);

namespace Apicore\Controllers;

use Apicore\Models\Import;
use Apicore\Schemas\ImportSchema;
use ValueError;

final class ImportController extends BaseController
{
    protected const MODEL_CLASS = Import::class;
    protected const SCHEMA = ImportSchema::class;

    public function create(array $data): int
    {
        if (
            array_key_exists('status', $data)
            && $data['status'] !== 'PENDING'
        ) {
            throw new ValueError(
                'New imports must start with PENDING status'
            );
        }

        $this->validate($data);

        if (!isset($this->model) || !$this->model instanceof Import) {
            throw new ValueError('Import model unavailable');
        }

        return $this->model->createWithDetails(
            $this->prepare($data)
        );
    }

    
public function patch(int|string $recordId, array $data): string
{
    if (array_key_exists('details', $data)) {
        throw new ValueError(
            'Import details cannot be modified after creation'
        );
    }

    if (array_key_exists('supplier_id', $data)) {
        throw new ValueError(
            'Supplier cannot be changed after import creation'
        );
    }

    if (array_key_exists('branch_id', $data)) {
        throw new ValueError(
            'Branch cannot be changed after import creation'
        );
    }

    $this->validate($data, true);

    // Validate status transitions before executing any operation.
    if (array_key_exists('status', $data)) {
        if (!isset($this->model) || !$this->model instanceof Import) {
            throw new ValueError('Import model unavailable');
        }

        $currentImport = $this->model->getById($recordId);

        if ($currentImport === null) {
            return parent::patch($recordId, $data);
        }

        ImportSchema::validateStatusTransition(
            $currentImport['status'],
            $data['status']
        );
    }

    // Receive the import only after validating its status transition.
    if (($data['status'] ?? null) === 'RECEIVED') {
        if (count($data) !== 1) {
            throw new ValueError(
                'Only status can be updated when receiving an import'
            );
        }

        return $this->model->receiveImport($recordId);
    }

    return parent::patch($recordId, $data);
}


    public function delete(int|string $recordId): bool
    {
        throw new ValueError('Imports cannot be deleted');
    }
}
