
const { pool } = require('../config/database');

// Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                p.product_id,
                p.name,
                b.name AS brand,
                c.name AS category,
                p.presentation,
                p.content_ml,
                p.alcohol_content,
                p.sale_price,
                p.status
            FROM products p
            INNER JOIN brands b ON p.brand_id = b.brand_id
            INNER JOIN categories c ON p.category_id = c.category_id
            ORDER BY p.product_id ASC
        `);

        res.json({
            status: 'OK',
            total: rows.length,
            products: rows
        });

    } catch (error) {
        console.error('Error al consultar productos:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudieron consultar los productos'
        });
    }
};


// Obtener un producto por ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El ID del producto no es válido'
            });
        }

        const [rows] = await pool.query(`
            SELECT
                p.product_id,
                p.name,
                b.name AS brand,
                c.name AS category,
                p.brand_id,
                p.category_id,
                p.presentation,
                p.content_ml,
                p.alcohol_content,
                p.sale_price,
                p.status
            FROM products p
            INNER JOIN brands b ON p.brand_id = b.brand_id
            INNER JOIN categories c ON p.category_id = c.category_id
            WHERE p.product_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'OK',
            product: rows[0]
        });

    } catch (error) {
        console.error('Error al consultar producto:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo consultar el producto'
        });
    }
};


// Registrar un producto nuevo
const createProduct = async (req, res) => {
    try {
        const {
            name,
            brand_id,
            category_id,
            presentation,
            content_ml,
            alcohol_content,
            sale_price,
            status
        } = req.body;

        if (
            typeof name !== 'string' || !name.trim() ||
            !brand_id ||
            !category_id ||
            typeof presentation !== 'string' || !presentation.trim() ||
            content_ml == null ||
            alcohol_content == null ||
            sale_price == null
        ) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Todos los campos obligatorios deben estar completos'
            });
        }

        if (
            !Number.isInteger(Number(brand_id)) ||
            !Number.isInteger(Number(category_id)) ||
            !Number.isInteger(Number(content_ml)) ||
            Number(content_ml) <= 0 ||
            !Number.isFinite(Number(alcohol_content)) ||
            Number(alcohol_content) < 0 ||
            !Number.isFinite(Number(sale_price)) ||
            Number(sale_price) < 0
        ) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Los datos numéricos no son válidos'
            });
        }

        const productStatus = status || 'ACTIVE';

        if (!['ACTIVE', 'INACTIVE', 'DISCONTINUED'].includes(productStatus)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El estado del producto no es válido'
            });
        }

        const [brands] = await pool.query(
            'SELECT brand_id FROM brands WHERE brand_id = ?',
            [brand_id]
        );

        if (brands.length === 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'La marca indicada no existe'
            });
        }

        const [categories] = await pool.query(
            'SELECT category_id FROM categories WHERE category_id = ?',
            [category_id]
        );

        if (categories.length === 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'La categoría indicada no existe'
            });
        }

        const [result] = await pool.query(`
            INSERT INTO products (
                name,
                brand_id,
                category_id,
                presentation,
                content_ml,
                alcohol_content,
                sale_price,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            name.trim(),
            brand_id,
            category_id,
            presentation.trim(),
            content_ml,
            alcohol_content,
            sale_price,
            productStatus
        ]);

        res.status(201).json({
            status: 'OK',
            message: 'Producto registrado correctamente',
            product_id: result.insertId
        });

    } catch (error) {
        console.error('Error al registrar producto:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo registrar el producto'
        });
    }
};


// Actualizar un producto por ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            brand_id,
            category_id,
            presentation,
            content_ml,
            alcohol_content,
            sale_price,
            status
        } = req.body;

        if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El ID del producto no es válido'
            });
        }

        if (
            typeof name !== 'string' || !name.trim() ||
            !brand_id ||
            !category_id ||
            typeof presentation !== 'string' || !presentation.trim() ||
            content_ml == null ||
            alcohol_content == null ||
            sale_price == null ||
            !status
        ) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Todos los campos son obligatorios para actualizar'
            });
        }

        if (
            !Number.isInteger(Number(brand_id)) ||
            !Number.isInteger(Number(category_id)) ||
            !Number.isInteger(Number(content_ml)) ||
            Number(content_ml) <= 0 ||
            !Number.isFinite(Number(alcohol_content)) ||
            Number(alcohol_content) < 0 ||
            !Number.isFinite(Number(sale_price)) ||
            Number(sale_price) < 0
        ) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Los datos numéricos no son válidos'
            });
        }

        if (!['ACTIVE', 'INACTIVE', 'DISCONTINUED'].includes(status)) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El estado del producto no es válido'
            });
        }

        const [existingProduct] = await pool.query(
            'SELECT product_id FROM products WHERE product_id = ?',
            [id]
        );

        if (existingProduct.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Producto no encontrado'
            });
        }

        const [brands] = await pool.query(
            'SELECT brand_id FROM brands WHERE brand_id = ?',
            [brand_id]
        );

        if (brands.length === 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'La marca indicada no existe'
            });
        }

        const [categories] = await pool.query(
            'SELECT category_id FROM categories WHERE category_id = ?',
            [category_id]
        );

        if (categories.length === 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'La categoría indicada no existe'
            });
        }

        await pool.query(`
            UPDATE products
            SET
                name = ?,
                brand_id = ?,
                category_id = ?,
                presentation = ?,
                content_ml = ?,
                alcohol_content = ?,
                sale_price = ?,
                status = ?
            WHERE product_id = ?
        `, [
            name.trim(),
            brand_id,
            category_id,
            presentation.trim(),
            content_ml,
            alcohol_content,
            sale_price,
            status,
            id
        ]);

        res.json({
            status: 'OK',
            message: 'Producto actualizado correctamente',
            product_id: Number(id)
        });

    } catch (error) {
        console.error('Error al actualizar producto:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo actualizar el producto'
        });
    }
};

// Desactivar producto por ID
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            `UPDATE products
             SET status = 'INACTIVE'
             WHERE product_id = ?`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'OK',
            message: 'Producto desactivado correctamente',
            product_id: Number(id)
        });

    } catch (error) {
        console.error('Error al desactivar producto:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo desactivar el producto'
        });
    }
};

// Exportar funciones
// Exportar funciones
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
