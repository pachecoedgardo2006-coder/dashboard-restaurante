// backend/src/controllers/historial.controller.js
import { conectarDB } from '../config/db.js';

/**
 * Obtiene el historial de órdenes finalizadas. 
 * Soporta de manera opcional filtrado por rango de fechas (?desde=YYYY-MM-DD&hasta=YYYY-MM-DD)
 */
export const obtenerHistorialAnalitico = async (req, res) => {
    try {
        const { desde, hasta } = req.query;
        const db = await conectarDB();
        
        // Base de la consulta: Solo estados cerrados
        let sql = `
            SELECT id, cliente_nombre, telefono, torre_bloque, apartamento, total, tipo_pago, paga_con, cambio, estado, fecha, observaciones
            FROM pedidos 
            WHERE estado IN ('Entregado', 'Cancelado')
        `;
        const params = [];

        // Si se proporcionan fechas, se anexa el filtro dinámico a la consulta
        if (desde && hasta) {
            sql += ` AND date(fecha, 'localtime') BETWEEN date(?) AND date(?)`;
            params.push(desde, hasta);
        }

        sql += ` ORDER BY fecha DESC`;

        const pedidosArchivados = await db.all(sql, params);
        
        // Adjuntar los ítems correspondientes a cada orden
        for (const pedido of pedidosArchivados) {
            pedido.items = await db.all(`
                SELECT dp.cantidad, dp.precio_historico, p.nombre 
                FROM detalle_pedidos dp
                JOIN productos p ON dp.producto_id = p.id
                WHERE dp.pedido_id = ?
            `, [pedido.id]);
        }

        await db.close();
        res.json(pedidosArchivados);

    } catch (error) {
        res.status(500).json({ error: 'Error al consultar el historial analítico: ' + error.message });
    }
};