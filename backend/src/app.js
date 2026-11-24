
const express = require('express');
const cors = require('cors');

const app = express();

// Rutas
const productsRoutes = require('./routes/products.routes');
const inventoryRoutes = require('./routes/inventory.routes');

// Middlewares globales
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas principales
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

module.exports = app;
