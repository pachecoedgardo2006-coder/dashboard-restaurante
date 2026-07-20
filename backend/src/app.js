// =============================================================================
// CONFIG — imports y creación de la app
// =============================================================================
import express from 'express';
import cors from 'cors';

import inventarioRoutes from './routes/inventario.routes.js';
import pedidosRoutes from './routes/pedidos.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';
import historialRoutes from './routes/historial.routes.js';

const app = express();

// =============================================================================
// MIDDLEWARES GLOBALES
// Deben ir SIEMPRE antes del montaje de rutas: si se registraran después,
// Express intentaría resolver la ruta sin CORS habilitado ni el body
// parseado, provocando bloqueos de Axios (CORS) o req.body === undefined
// en los controladores.
// =============================================================================

// Habilita CORS para que el cliente (Axios) pueda consumir la API sin ser
// bloqueado por el navegador. Política sin cambios (origen abierto): no se
// restringe a un origin específico para no alterar el comportamiento actual
// sin consenso del equipo.
app.use(cors());

// Parseo de JSON en el body de las peticiones (requerido por Axios cuando
// envía 'Content-Type: application/json'). Debe ir antes de las rutas para
// que req.body esté disponible en los controladores.
app.use(express.json());

// =============================================================================
// RUTAS — montaje de los endpoints de la API REST
// =============================================================================
app.use('/api/inventario', inventarioRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/historial', historialRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

// =============================================================================
// HANDLERS — manejo de rutas no encontradas (siempre al final)
// =============================================================================
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado' });
});

export default app;