import api from '../../services/api.js';
import { CardMetrica } from './modules/CardMetrica.js';
import { GraficoProgreso } from './modules/GraficoProgreso.js';
import { SeccionAnalitica } from './modules/SeccionAnalitica.js';

export async function renderEstadisticas() {
    const container = document.createElement('div');
    container.className = 'space-y-8 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Métricas de Rendimiento</h1>
            <p class="text-xs text-slate-400 mt-1">Resumen financiero, logístico y residencial mapeado en tiempo real.</p>
        </header>

        <div id="loader-estadisticas" class="text-center py-12 text-slate-400 text-xs animate-pulse">
            Compilando analíticas avanzadas desde base de datos...
        </div>

        <div id="contenido-estadisticas" class="hidden space-y-8">
            <div id="contenedor-secciones" class="space-y-8"></div>
            <div class="space-y-4 pt-4 border-t border-slate-900">
                <div class="border-l-2 border-slate-800 pl-3">
                    <h2 class="text-sm font-bold text-slate-200 tracking-wide uppercase">📊 Diagnósticos y Proporciones</h2>
                    <p class="text-xs text-slate-500 mt-0.5">Rotación de stock, flujos residenciales y recurrencia de consumo.</p>
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
                    descripcion: 'Auditoría de ingresos efectivos y capitalización de flujos de pago.',
                    metrics: [
                        { titulo: 'Ingresos Totales (Caja)', valor: `$${(data.ingresos_totales || 0).toFixed(2)}`, icono: '💰', color: 'text-emerald-400', bgIcono: 'bg-emerald-500/10 border-emerald-500/20' },
                        { titulo: 'Ventas en Efectivo', valor: `$${(data.ingresos_efectivo || 0).toFixed(2)}`, icono: '💵', color: 'text-green-400', bgIcono: 'bg-green-500/10 border-green-500/20' },
                        { titulo: 'Ventas por Transferencia', valor: `$${(data.ingresos_transferencia || 0).toFixed(2)}`, icono: '📱', color: 'text-indigo-400', bgIcono: 'bg-indigo-500/10 border-indigo-500/20' }
                    ]
                },
                {
                    titulo: '📦 Control Operativo y Logística',
                    descripcion: 'Métricas de rendimiento de pedidos y balance de base para repartidores.',
                    metrics: [
                        { titulo: 'Ticket Promedio', valor: `$${(data.ticket_promedio || 0).toFixed(2)}`, icono: '🎟️', color: 'text-cyan-400', bgIcono: 'bg-cyan-500/10 border-cyan-500/20' },
                        { titulo: 'Pedidos Efectivos', valor: data.pedidos_entregados || 0, icono: '✅', color: 'text-blue-400', bgIcono: 'bg-blue-500/10 border-blue-500/20' },
                        { titulo: 'Cambio en Ruta (Domicilios)', valor: `$${(data.cambio_en_ruta || 0).toFixed(2)}`, icono: '🛵', color: 'text-orange-400', bgIcono: 'bg-orange-500/10 border-orange-500/20' }
                    ]
                },
                {
                    titulo: '🏢 Mapeo de Demanda y Cancelaciones',
                    descripcion: 'Análisis del comportamiento del conjunto residencial e incidencias.',
                    metrics: [
                        { titulo: 'Zona de Mayor Demanda', valor: data.zona_pico || 'N/A', icono: '🏢', color: 'text-purple-400', bgIcono: 'bg-purple-500/10 border-purple-500/20' },
                        { titulo: 'Hora Pico de Ventas', valor: data.hora_pico || 'N/A', icono: '⏰', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20' },
                        { titulo: 'Órdenes Canceladas', valor: data.pedidos_cancelados || 0, icono: '❌', color: 'text-red-400', bgIcono: 'bg-red-500/10 border-red-500/20' }
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

            // Inyecciones de Gráficos de Progreso estructurados
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🔥 Top de Ventas en el Menú',
                descripcion: 'Platos con mayor índice de rotación dentro del conjunto.',
                items: (data.productos_mas_vendidos || []).map(p => ({ nombre: p.nombre, valor: p.total_vendido, etiquetaValor: `${p.total_vendido} u.` })),
                deColor: 'from-cyan-500', aColor: 'to-blue-600'
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: '👑 Clientes Frecuentes',
                descripcion: 'Residentes con mayor frecuencia de compra registrada.',
                items: (data.clientes_frecuentes || []).map(c => ({ nombre: c.cliente_nombre, valor: c.total_pedidos, etiquetaValor: `${c.total_pedidos} órdenes` })),
                deColor: 'from-purple-500', aColor: 'to-pink-600'
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🏢 Flujo de Pedidos por Torre',
                descripcion: 'Volumen operativo distribuido geográficamente en el conjunto.',
                items: (data.ranking_torres || []).map(t => ({ nombre: `Torre / Bloque ${t.torre_bloque}`, valor: t.total_pedidos, etiquetaValor: `${t.total_pedidos} ped.` })),
                deColor: 'from-amber-500', aColor: 'to-orange-600'
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🚨 Alerta de Inventario Crítico',
                descripcion: 'Insumos y platos con stock igual o inferior a 10 unidades.',
                items: (data.stock_critico || []).map(s => ({ nombre: s.nombre, valor: s.stock === 0 ? 0.1 : s.stock, etiquetaValor: `${s.stock} unidades` })),
                deColor: 'from-red-500', aColor: 'to-rose-700'
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