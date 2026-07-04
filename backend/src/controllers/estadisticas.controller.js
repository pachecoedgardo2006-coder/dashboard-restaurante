// backend/src/controllers/estadisticas.controller.js
import { conectarDB } from '../config/db.js';

export const obtenerEstadisticas = async (req, res) => {
    let db;
    try {
        db = await conectarDB();

        // 1. Resumen Financiero Expandido (Solo pedidos efectivos computan caja)
        const resumenFinanciero = await db.get(`
            SELECT 
                SUM(total) as ingresos_totales,
                AVG(total) as ticket_promedio,
                COUNT(id) as total_pedidos,
                SUM(CASE WHEN tipo_pago = 'Efectivo' THEN total ELSE 0 END) as ingresos_efectivo,
                SUM(CASE WHEN tipo_pago = 'Transferencia' THEN total ELSE 0 END) as ingresos_transferencia
            FROM pedidos 
            WHERE estado = 'Entregado'
        `);

        // 2. Conteo de Estados y Logística de Cambio en Ruta (Pendientes o En preparación)
        const logisticaYEstados = await db.get(`
            SELECT 
                COUNT(CASE WHEN estado = 'Entregado' THEN 1 END) as entregados,
                COUNT(CASE WHEN estado = 'Cancelado' THEN 1 END) as cancelados,
                SUM(CASE WHEN estado IN ('Pendiente', 'En preparación') AND tipo_pago = 'Efectivo' THEN cambio ELSE 0 END) as cambio_en_ruta
            FROM pedidos
        `);

        // 3. Zona (Torre / Bloque) con mayor demanda (Para la tarjeta principal)
        const zonaPico = await db.get(`
            SELECT torre_bloque, COUNT(id) as cantidad
            FROM pedidos
            WHERE estado != 'Cancelado'
            GROUP BY torre_bloque
            ORDER BY cantidad DESC
            LIMIT 1
        `);

        // 4. Hora pico de pedidos
        const horaPico = await db.get(`
            SELECT 
                SUBSTR(datetime(fecha, 'localtime'), 12, 2) as hora, 
                COUNT(id) as cantidad
            FROM pedidos
            WHERE estado != 'Cancelado'
            GROUP BY hora
            ORDER BY cantidad DESC
            LIMIT 1
        `);

        // 5. Top 5 de productos más vendidos
        const productosMasVendidos = await db.all(`
            SELECT p.nombre, SUM(dp.cantidad) as total_vendido
            FROM detalle_pedidos dp
            JOIN productos p ON dp.producto_id = p.id
            JOIN pedidos ped ON dp.pedido_id = ped.id
            WHERE ped.estado != 'Cancelado'
            GROUP BY p.id
            ORDER BY total_vendido DESC
            LIMIT 5
        `);

        // 6. Top 5 de Clientes Frecuentes
        const clientesFrecuentes = await db.all(`
            SELECT cliente_nombre, COUNT(id) as total_pedidos
            FROM pedidos
            WHERE estado != 'Cancelado'
            GROUP BY cliente_nombre
            ORDER BY total_pedidos DESC
            LIMIT 5
        `);

        // --- NUEVAS CONSULTAS COMPLEMENTARIAS ---

        // 7. Ranking General de todas las Torres/Bloques para el nuevo gráfico
        const rankingTorres = await db.all(`
            SELECT torre_bloque, COUNT(id) as total_pedidos
            FROM pedidos
            WHERE estado != 'Cancelado'
            GROUP BY torre_bloque
            ORDER BY total_pedidos DESC
        `);

        // 8. Alerta de Stock Crítico (Productos con 10 o menos unidades disponibles)
        const stockCritico = await db.all(`
            SELECT nombre, stock
            FROM productos
            WHERE stock <= 10
            ORDER BY stock ASC
            LIMIT 5
        `);

        // Formateo elegante de hora militar a legible
        let horaLegible = 'N/A';
        if (horaPico && horaPico.hora) {
            // Limpiamos cualquier residuo como ":" si la hora vino como "07:"
            let horaLimpia = horaPico.hora.replace(':', '').trim();
            const h = parseInt(horaLimpia, 10);
            
            if (!isNaN(h)) {
                horaLegible = h >= 12 ? `${h === 12 ? 12 : h - 12} PM` : `${h === 0 ? 12 : h} AM`;
            } else {
                horaLegible = horaPico.hora; // Si no es número, enviamos el texto tal cual
            }
        }

        res.json({
            ingresos_totales: resumenFinanciero.ingresos_totales || 0,
            ticket_promedio: resumenFinanciero.ticket_promedio || 0,
            ingresos_efectivo: resumenFinanciero.ingresos_efectivo || 0,
            ingresos_transferencia: resumenFinanciero.ingresos_transferencia || 0,
            pedidos_entregados: logisticaYEstados.entregados || 0,
            pedidos_cancelados: logisticaYEstados.cancelados || 0,
            cambio_en_ruta: logisticaYEstados.cambio_en_ruta || 0,
            zona_pico: zonaPico ? `Torre ${zonaPico.torre_bloque}` : 'N/A',
            hora_pico: horaLegible,
            productos_mas_vendidos: productosMasVendidos,
            clientes_frecuentes: clientesFrecuentes,
            ranking_torres: rankingTorres,
            stock_critico: stockCritico
        });

    } catch (error) {
        res.status(500).json({ error: 'Error al generar las estadísticas: ' + error.message });
    } finally {
        if (db) await db.close();
    }
};