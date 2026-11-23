const app = require('./src/app');
const { testConnection } = require('./src/config/database');

require('dotenv').config();

const PORT = process.env.PORT || 3001;

async function startServer() {
    const connected = await testConnection();

    if (!connected) {
        console.error('No se pudo iniciar el servidor por un problema con MariaDB.');
        process.exit(1);
    }

    app.listen(PORT, '0.0.0.0', () => {
        console.log(`FRIJA BREWERY API ejecutándose en el puerto ${PORT}`);
    });
}

startServer();
