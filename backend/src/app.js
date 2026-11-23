const express = require('express');
const cors = require('cors');

const app = express();
const { pool } = require('./config/database'); 
const productsRoutes = require('./routes/products.routes'); 
const inventoryRoutes = require('./routes/inventory.routes');

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRoutes);

app.use('/api/inventory', inventoryRoutes); 

// Ruta principal
app.get('/', (req, res) => {
    res.json({
        message: 'API de FRIJA BREWERY funcionando correctamente',
        status: 'OK'
    });
});

// Ruta de salud
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Servidor disponible'
    });
});
// Ruta de prueba: consultar productos en MariaDB
// Ruta de prueba: consultar productos en MariaDB
app.get('/api/test-db', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT product_id, name, presentation, content_ml,
                    alcohol_content, sale_price, status
             FROM products
             LIMIT 10`
        );

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
});

module.exports = app;
