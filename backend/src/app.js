import express from 'express';
import cors from 'cors';

// Importación de rutas
import inventarioRoutes from './routes/inventario.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import historialRoutes from './routes/historial.routes.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Inyección de Endpoints de la API REST
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// Manejo global de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

export default app;