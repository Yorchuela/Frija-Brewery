<?php
declare(strict_types=1);

namespace Apicore\Tests;

use Apicore\Controllers\ImportController;
use Apicore\Schemas\ImportSchema;
use ReflectionClass;
use ValueError;

final class ImportTest extends TestCase
{
    private function controller(): ImportController
    {
        return (new ReflectionClass(ImportController::class))
            ->newInstanceWithoutConstructor();
    }

    private function validImport(): array
    {
        return [
            'supplier_id' => 2,
            'branch_id' => 1,
            'import_date' => '2026-11-26',
            'document_number' => 'FRIJA-TEST-001',
            'details' => [
                [
                    'product_id' => 1,
                    'quantity' => 10,
                    'unit_cost' => 25.50,
                ],
            ],
        ];
    }

    public function testValidImportPassesSchema(): void
    {
        ImportSchema::validate($this->validImport());
        $this->assertTrue(true);
    }

    public function testBranchIdIsRequired(): void
    {
        $data = $this->validImport();
        unset($data['branch_id']);

        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validate($data),
        );
    }

    public function testEmptyDetailsAreRejected(): void
    {
        $data = $this->validImport();
        $data['details'] = [];

        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validate($data),
        );
    }

    public function testDuplicateProductsAreRejected(): void
    {
        $data = $this->validImport();
        $data['details'][] = [
            'product_id' => 1,
            'quantity' => 5,
            'unit_cost' => 20.00,
        ];

        $error = $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validate($data),
        );

        $this->assertSame(
            'A product cannot appear more than once in details',
            $error->getMessage(),
        );
    }

    public function testInvalidStatusIsRejected(): void
    {
        $data = ['status' => 'APPROVED'];

        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validate($data, true),
        );
    }

    public function testNewImportCannotStartAsReceived(): void
    {
        $data = $this->validImport();
        $data['status'] = 'RECEIVED';

        $this->assertThrows(
            ValueError::class,
            fn () => $this->controller()->create($data),
        );
    }

    public function testImportDetailsCannotBeModified(): void
    {
        $this->assertThrows(
            ValueError::class,
            fn () => $this->controller()->patch(1, [
                'details' => [],
            ]),
        );
    }

    public function testSupplierCannotBeChanged(): void
    {
        $this->assertThrows(
            ValueError::class,
            fn () => $this->controller()->patch(1, [
                'supplier_id' => 3,
            ]),
        );
    }

    public function testBranchCannotBeChanged(): void
    {
        $this->assertThrows(
            ValueError::class,
            fn () => $this->controller()->patch(1, [
                'branch_id' => 2,
            ]),
        );
    }

    public function testImportsCannotBeDeleted(): void
    {
        $this->assertThrows(
            ValueError::class,
            fn () => $this->controller()->delete(1),
        );
    }


    public function testPendingCanTransitionToInTransit(): void
    {
        ImportSchema::validateStatusTransition(
            'PENDING',
            'IN_TRANSIT'
        );

        $this->assertTrue(true);
    }

    public function testPendingCanTransitionToCancelled(): void
    {
        ImportSchema::validateStatusTransition(
            'PENDING',
            'CANCELLED'
        );

        $this->assertTrue(true);
    }

    public function testInTransitCanTransitionToCancelled(): void
    {
        ImportSchema::validateStatusTransition(
            'IN_TRANSIT',
            'CANCELLED'
        );

        $this->assertTrue(true);
    }

    public function testSameStatusIsAllowed(): void
    {
        ImportSchema::validateStatusTransition(
            'PENDING',
            'PENDING'
        );

        $this->assertTrue(true);
    }

    public function testReceivedCannotTransitionToCancelled(): void
    {
        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validateStatusTransition(
                'RECEIVED',
                'CANCELLED'
            ),
        );
    }

    public function testCancelledCannotTransitionToInTransit(): void
    {
        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validateStatusTransition(
                'CANCELLED',
                'IN_TRANSIT'
            ),
        );
    }

    public function testPendingCannotTransitionDirectlyToReceived(): void
    {
        $this->assertThrows(
            ValueError::class,
            static fn () => ImportSchema::validateStatusTransition(
                'PENDING',
                'RECEIVED'
            ),
        );
    }

}
