import app from './src/app.js';
import { inicializarDB } from './src/config/db.js';

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Garantizar que las tablas existan antes de escuchar peticiones
        await inicializarDB();
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor debido a un fallo en la DB:', error);
        process.exit(1);
    }
}

startServer();