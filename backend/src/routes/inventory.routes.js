const express = require('express');
const router = express.Router();

const {
    getInventory,
    getInventoryById,
    getInventoryByBranch,
    updateStock,
    updateMinimumStock
} = require('../controllers/inventory.controller');

// GET: Consultar todo el inventario
router.get('/', getInventory);

// GET: Consultar inventario por sucursal
router.get('/branch/:branchId', getInventoryByBranch);

// GET: Consultar registro de inventario por ID
router.get('/:id', getInventoryById);

// PUT: Actualizar existencias
router.put('/:id/stock', updateStock);

// PUT: Actualizar stock mínimo
router.put('/:id/minimum-stock', updateMinimumStock);

module.exports = router;
