import api from '../../services/api.js';
import { CardMetrica } from './modules/CardMetrica.js';
import { GraficoProgreso } from './modules/GraficoProgreso.js';
import { SeccionAnalitica } from './modules/SeccionAnalitica.js';
import { DonutChart } from './modules/DonutChart.js';

export async function renderEstadisticas() {
    const container = document.createElement('div');
    container.className = 'space-y-8 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-900 pb-4">
           <h1 class="text-2xl font-black tracking-tight text-[#121212] sm:text-3xl uppercase">Métricas de Rendimiento</h1>
            <p class="text-xs text-slate-400 mt-1">Resumen financiero, logístico y residencial de House Grill 6 en tiempo real.</p>
        </header>

        <div id="loader-estadisticas" class="text-center py-12 text-slate-500 text-xs font-mono animate-pulse">
            🔥 Encendiendo motores y compilando analíticas de la parrilla...
        </div>

        <div id="contenido-estadisticas" class="hidden space-y-8">
            <div id="contenedor-secciones" class="space-y-8"></div>
            <div class="space-y-4 pt-4 border-t border-slate-900/60">
                <div class="border-l-2 border-slate-800 pl-3">
                    <h2 class="text-xs font-black text-slate-300 tracking-wider uppercase">📊 Diagnósticos y Proporciones</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Rotación de combos, flujos de bloques residenciales y recurrencia de consumo.</p>
                </div>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" id="grid-graficos"></div>
            </div>
        </div>
    `;

    const loader = container.querySelector('#loader-estadisticas');
    const contenido = container.querySelector('#contenido-estadisticas');
    const contenedorSecciones = container.querySelector('#contenedor-secciones');
    const gridGraficos = container.querySelector('#grid-graficos');

    async function cargarAnaliticas() {
        try {
            const data = await api.get('/estadisticas');

            const seccionesConfig = [
                {
                    titulo: '💰 Gestión Financiera y Caja',
                    descripcion: 'Auditoría de ingresos en efectivo y capitalización de flujos de pago.',
                    metrics: [
                        { titulo: 'Ingresos Totales (Caja)', valor: `$${(data.ingresos_totales || 0).toFixed(2)}`, icono: '🔥', color: 'text-red-500', bgIcono: 'bg-red-500/10 border-red-500/20 text-red-400' },
                        { titulo: 'Ventas en Efectivo', valor: `$${(data.ingresos_efectivo || 0).toFixed(2)}`, icono: '💵', color: 'text-slate-200', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' },
                        { titulo: 'Ventas por Transferencia', valor: `$${(data.ingresos_transferencia || 0).toFixed(2)}`, icono: '📱', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' }
                    ]
                },
                {
                    titulo: '📦 Control Operativo y Logística',
                    descripcion: 'Métricas de rendimiento de comandas y base asignada a repartidores.',
                    metrics: [
                        { titulo: 'Ticket Promedio', valor: `$${(data.ticket_promedio || 0).toFixed(2)}`, icono: '🎟️', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                        { titulo: 'Pedidos Efectivos', valor: data.pedidos_entregados || 0, icono: '✅', color: 'text-red-500', bgIcono: 'bg-red-500/10 border-red-500/20 text-red-400' },
                        { titulo: 'Cambio en Ruta (Domicilios)', valor: `$${(data.cambio_en_ruta || 0).toFixed(2)}`, icono: '🛵', color: 'text-slate-300', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' }
                    ]
                },
                {
                    titulo: '🏢 Mapeo de Demanda y Cancelaciones',
                    descripcion: 'Análisis del comportamiento del conjunto residencial e incidencias operativas.',
                    metrics: [
                        { titulo: 'Bloque de Mayor Demanda', valor: data.zona_pico || 'N/A', icono: '🏢', color: 'text-slate-200', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' },
                        { titulo: 'Hora Pico de Ventas', valor: data.hora_pico || 'N/A', icono: '⏰', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                        { titulo: 'Órdenes Canceladas', valor: data.pedidos_cancelados || 0, icono: '❌', color: 'text-red-600', bgIcono: 'bg-red-950/20 border-red-900/30 text-red-500' }
                    ]
                }
            ];

            seccionesConfig.forEach(sec => {
                const nuevaSeccion = SeccionAnalitica({ titulo: sec.titulo, descripcion: sec.descripcion });
                const gridCards = nuevaSeccion.querySelector('.id-grid-cards');

                sec.metrics.forEach(m => {
                    gridCards.appendChild(CardMetrica(m));
                });
                contenedorSecciones.appendChild(nuevaSeccion);
            });

            // Inyecciones de Gráficos de Progreso con paletas de los anuncios de House Grill 6
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🍔 Top Combos y Caseritas',
                descripcion: 'Platos con mayor índice de rotación en la parrilla.',
                items: (data.productos_mas_vendidos || []).map(p => ({ nombre: p.nombre, valor: p.total_vendido, etiquetaValor: `${p.total_vendido} u.` })),
                deColor: 'from-red-600', aColor: 'to-amber-500'
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: '👑 Clientes Frecuentes',
                descripcion: 'Residentes con mayor frecuencia de pedidos acumulada.',
                items: (data.clientes_frecuentes || []).map(c => ({ nombre: c.cliente_nombre, valor: c.total_pedidos, etiquetaValor: `${c.total_pedidos} pedidos` })),
                deColor: 'from-slate-800', aColor: 'to-slate-600'
            }));

           gridGraficos.appendChild(DonutChart({
                titulo: '🏢 Distribución por Torres',
                descripcion: 'Proporción de pedidos por torre/bloque residencial.',
                items: (data.ranking_torres || []).map(t => ({ nombre: `Torre ${t.torre_bloque}`, valor: t.total_pedidos }))
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🚨 Alerta de Inventario Crítico',
                descripcion: 'Insumos de cocina con stock crítico (igual o inferior a 10 unidades).',
                items: (data.stock_critico || []).map(s => ({ nombre: s.nombre, valor: s.stock === 0 ? 0.1 : s.stock, etiquetaValor: `${s.stock} und.` })),
                deColor: 'from-red-700', aColor: 'to-red-500'
            }));

            loader.classList.add('hidden');
            contenido.classList.remove('hidden');
        } catch (error) {
            console.error('Error al desplegar gráficos analíticos:', error);
            loader.textContent = 'Hubo un error de red o de base de datos al renderizar analíticas.';
        }
    }

    await cargarAnaliticas();
    return container;
}