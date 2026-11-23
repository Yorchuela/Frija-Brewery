
const express = require('express');
const router = express.Router();


const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

// GET: Consultar todos los productos
router.get('/', getProducts);

// GET: Consultar producto por ID
router.get('/:id', getProductById);

// POST: Registrar producto
router.post('/', createProduct);

// PUT: Actualizar producto por ID
router.put('/:id', updateProduct);

// DELETE: Desactivar producto por ID
router.delete('/:id', deleteProduct);

module.exports = router;
