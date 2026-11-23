
const { pool } = require('../config/database');

// GET: Consultar todo el inventario
const getInventory = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                i.inventory_id,
                i.branch_id,
                b.name AS branch,
                i.product_id,
                p.name AS product,
                i.stock,
                i.minimum_stock,
                i.last_update,
                CASE
                    WHEN i.stock <= i.minimum_stock THEN 'LOW'
                    ELSE 'NORMAL'
                END AS stock_status
            FROM inventory i
            INNER JOIN branches b
                ON i.branch_id = b.branch_id
            INNER JOIN products p
                ON i.product_id = p.product_id
            ORDER BY i.branch_id, p.name
        `);

        res.status(200).json({
            status: 'OK',
            total: rows.length,
            inventory: rows
        });

    } catch (error) {
        console.error('Error al consultar inventario:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo consultar el inventario'
        });
    }
};

// GET: Consultar inventario por ID
const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(`
            SELECT
                i.inventory_id,
                i.branch_id,
                b.name AS branch,
                i.product_id,
                p.name AS product,
                i.stock,
                i.minimum_stock,
                i.last_update
            FROM inventory i
            INNER JOIN branches b
                ON i.branch_id = b.branch_id
            INNER JOIN products p
                ON i.product_id = p.product_id
            WHERE i.inventory_id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Registro de inventario no encontrado'
            });
        }

        res.status(200).json({
            status: 'OK',
            inventory: rows[0]
        });

    } catch (error) {
        console.error('Error al consultar inventario:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo consultar el inventario'
        });
    }
};

// GET: Consultar inventario por sucursal
const getInventoryByBranch = async (req, res) => {
    try {
        const { branchId } = req.params;

        const [rows] = await pool.query(`
            SELECT
                i.inventory_id,
                i.branch_id,
                i.product_id,
                p.name AS product,
                i.stock,
                i.minimum_stock,
                i.last_update
            FROM inventory i
            INNER JOIN products p
                ON i.product_id = p.product_id
            WHERE i.branch_id = ?
            ORDER BY p.name
        `, [branchId]);

        res.status(200).json({
            status: 'OK',
            total: rows.length,
            inventory: rows
        });

    } catch (error) {
        console.error('Error al consultar inventario por sucursal:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo consultar el inventario de la sucursal'
        });
    }
};

// PUT: Actualizar existencias
const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;

        if (!Number.isInteger(stock) || stock < 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El stock debe ser un número entero mayor o igual a cero'
            });
        }

        const [result] = await pool.query(
            'UPDATE inventory SET stock = ? WHERE inventory_id = ?',
            [stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Registro de inventario no encontrado'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Existencias actualizadas correctamente',
            inventory_id: Number(id),
            stock
        });

    } catch (error) {
        console.error('Error al actualizar existencias:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudieron actualizar las existencias'
        });
    }
};

// PUT: Actualizar stock mínimo
const updateMinimumStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { minimum_stock } = req.body;

        if (!Number.isInteger(minimum_stock) || minimum_stock < 0) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'El stock mínimo debe ser un número entero mayor o igual a cero'
            });
        }

        const [result] = await pool.query(
            'UPDATE inventory SET minimum_stock = ? WHERE inventory_id = ?',
            [minimum_stock, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'ERROR',
                message: 'Registro de inventario no encontrado'
            });
        }

        res.status(200).json({
            status: 'OK',
            message: 'Stock mínimo actualizado correctamente',
            inventory_id: Number(id),
            minimum_stock
        });

    } catch (error) {
        console.error('Error al actualizar stock mínimo:', error.message);

        res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo actualizar el stock mínimo'
        });
    }
};


// POST: Registrar movimiento de inventario
const registerInventoryMovement = async (req, res) => {
    const { branch_id, product_id, type, quantity, reason } = req.body;

    // Validaciones
    if (
        !Number.isInteger(branch_id) || branch_id <= 0 ||
        !Number.isInteger(product_id) || product_id <= 0 ||
        !Number.isInteger(quantity) || quantity <= 0 ||
        !['IN', 'OUT', 'ADJUSTMENT'].includes(type)
    ) {
        return res.status(400).json({
            status: 'ERROR',
            message: 'Datos inválidos. Verifica sucursal, producto, tipo y cantidad.'
        });
    }

    if (reason && reason.length > 100) {
        return res.status(400).json({
            status: 'ERROR',
            message: 'El motivo no puede superar 100 caracteres.'
        });
    }

    let connection;

    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Buscar y bloquear el registro de inventario
        const [rows] = await connection.query(
            `SELECT inventory_id, stock
             FROM inventory
             WHERE branch_id = ? AND product_id = ?
             FOR UPDATE`,
            [branch_id, product_id]
        );

        if (rows.length === 0) {
            await connection.rollback();

            return res.status(404).json({
                status: 'ERROR',
                message: 'No existe inventario para ese producto en esa sucursal.'
            });
        }

        const inventory = rows[0];
        let newStock = Number(inventory.stock);

        // Calcular existencias nuevas
        if (type === 'IN') {
            newStock += quantity;
        } else if (type === 'OUT') {
            if (newStock < quantity) {
                await connection.rollback();

                return res.status(400).json({
                    status: 'ERROR',
                    message: 'No hay existencias suficientes para realizar la salida.'
                });
            }

            newStock -= quantity;
        } else if (type === 'ADJUSTMENT') {
            newStock = quantity;
        }

        // Actualizar inventario
        await connection.query(
            'UPDATE inventory SET stock = ? WHERE inventory_id = ?',
            [newStock, inventory.inventory_id]
        );

        // Registrar movimiento
        await connection.query(
            `INSERT INTO inventory_movements
             (branch_id, product_id, type, quantity, reason)
             VALUES (?, ?, ?, ?, ?)`,
            [branch_id, product_id, type, quantity, reason || null]
        );

        await connection.commit();

        return res.status(201).json({
            status: 'OK',
            message: 'Movimiento de inventario registrado correctamente.',
            movement: {
                branch_id,
                product_id,
                type,
                quantity,
                previous_stock: Number(inventory.stock),
                new_stock: newStock,
                reason: reason || null
            }
        });

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }

        console.error('Error al registrar movimiento:', error.message);

        return res.status(500).json({
            status: 'ERROR',
            message: 'No se pudo registrar el movimiento de inventario.'
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
};


module.exports = {
    getInventory,
    getInventoryById,
    getInventoryByBranch,
    updateStock,
    updateMinimumStock,
    registerInventoryMovement
};
