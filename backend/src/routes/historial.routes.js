import { Router } from 'express';
import { obtenerHistorialAnalitico } from '../controllers/historial.controller.js';

const router = Router();

// Endpoint dedicado al historial
router.get('/', obtenerHistorialAnalitico);

export default router;