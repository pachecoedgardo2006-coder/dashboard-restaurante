import api from '../../services/api.js';
import { CardMetrica } from './modules/CardMetrica.js';
import { GraficoProgreso } from './modules/GraficoProgreso.js';
import { SeccionAnalitica } from './modules/SeccionAnalitica.js';
import { DonutChart } from './modules/DonutChart.js';
import { t } from '../../i18n/i18n.js';

export async function renderEstadisticas() {
    const container = document.createElement('div');
    container.className = 'space-y-8 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-900 pb-4">
           <h1 class="text-2xl font-black tracking-tight text-[#121212] sm:text-3xl uppercase">${t('estadisticas.titulo')</h1>
            <p class="text-xs text-slate-400 mt-1">${t('estadisticas.subtitulo')}</p>
        </header>

        <div id="loader-estadisticas" class="text-center py-12 text-slate-500 text-xs font-mono animate-pulse">
            ${t('estadisticas.cargandoAnaliticas')}
        </div>

        <div id="contenido-estadisticas" class="hidden space-y-8">
            <div id="contenedor-secciones" class="space-y-8"></div>
            <div class="space-y-4 pt-4 border-t border-slate-900/60">
                <div class="border-l-2 border-slate-800 pl-3">
                    <h2 class="text-xs font-black text-slate-300 tracking-wider uppercase">${t('estadisticas.diagnosticosTitulo')}</h2>
                    <p class="text-xs text-slate-500 mt-0.5">${t('estadisticas.diagnosticosSubtitulo')}</p>
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
                    titulo: t('estadisticas.seccionFinanciera.titulo'),
                    descripcion: t('estadisticas.seccionFinanciera.descripcion'),
                    metrics: [
                        { titulo: t('estadisticas.metric.ingresosTotales'), valor: `$${(data.ingresos_totales || 0).toFixed(2)}`, icono: '🔥', color: 'text-red-500', bgIcono: 'bg-red-500/10 border-red-500/20 text-red-400' },
                        { titulo: t('estadisticas.metric.ventasEfectivo'), valor: `$${(data.ingresos_efectivo || 0).toFixed(2)}`, icono: '💵', color: 'text-slate-200', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' },
                        { titulo: t('estadisticas.metric.ventasTransferencia'), valor: `$${(data.ingresos_transferencia || 0).toFixed(2)}`, icono: '📱', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' }
                    ]
                },
                {
                    titulo: t('estadisticas.seccionOperativa.titulo'),
                    descripcion: t('estadisticas.seccionOperativa.descripcion'),
                    metrics: [
                        { titulo: t('estadisticas.metric.ticketPromedio'), valor: `$${(data.ticket_promedio || 0).toFixed(2)}`, icono: '🎟️', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                        { titulo: t('estadisticas.metric.pedidosEfectivos'), valor: data.pedidos_entregados || 0, icono: '✅', color: 'text-red-500', bgIcono: 'bg-red-500/10 border-red-500/20 text-red-400' },
                        { titulo: t('estadisticas.metric.cambioEnRuta'), valor: `$${(data.cambio_en_ruta || 0).toFixed(2)}`, icono: '🛵', color: 'text-slate-300', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' }
                    ]
                },
                {
                    titulo: t('estadisticas.seccionDemanda.titulo'),
                    descripcion: t('estadisticas.seccionDemanda.descripcion'),
                    metrics: [
                        { titulo: t('estadisticas.metric.bloqueMayorDemanda'), valor: data.zona_pico || 'N/A', icono: '🏢', color: 'text-slate-200', bgIcono: 'bg-slate-900 border-slate-800 text-slate-400' },
                        { titulo: t('estadisticas.metric.horaPico'), valor: data.hora_pico || 'N/A', icono: '⏰', color: 'text-amber-400', bgIcono: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                        { titulo: t('estadisticas.metric.ordenesCanceladas'), valor: data.pedidos_cancelados || 0, icono: '❌', color: 'text-red-600', bgIcono: 'bg-red-950/20 border-red-900/30 text-red-500' }
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
                titulo: t('estadisticas.graficoCombos.titulo'),
                descripcion: t('estadisticas.graficoCombos.descripcion'),
                items: (data.productos_mas_vendidos || []).map(p => ({ nombre: p.nombre, valor: p.total_vendido, etiquetaValor: t('estadisticas.graficoCombosEtiqueta', { n: p.total_vendido }) })),
                deColor: 'from-red-600', aColor: 'to-amber-500'
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: t('estadisticas.graficoClientes.titulo'),
                descripcion: t('estadisticas.graficoClientes.descripcion'),
                items: (data.clientes_frecuentes || []).map(c => ({ nombre: c.cliente_nombre, valor: c.total_pedidos, etiquetaValor: t('estadisticas.graficoClientes.etiquetaValor', { n: c.total_pedidos }) })),
                deColor: 'from-slate-800', aColor: 'to-slate-600'
            }));

           gridGraficos.appendChild(DonutChart({
                titulo: t('estadisticas.graficoTorres.titulo'),
                descripcion: t('estadisticas.graficoTorres.descripcion')',
                items: items: (data.ranking_torres || []).map(t2 => ({ nombre: t('estadisticas.graficoTorres.nombreItem', { torre: t2.torre_bloque }), valor: t2.total_pedidos, etiquetaValor: t('estadisticas.graficoTorres.etiquetaValor', { n: t2.total_pedidos }) })),
            }));

            gridGraficos.appendChild(GraficoProgreso({
                titulo: t('estadisticas.graficoStock.titulo'),
                descripcion: t('estadisticas.graficoStock.descripcion'),
                items: (data.stock_critico || []).map(s => ({ nombre: s.nombre, valor: s.stock === 0 ? 0.1 : s.stock, etiquetaValor: t('estadisticas.graficoStock.etiquetaValor', { n: s.stock }) })),
                deColor: 'from-red-700', aColor: 'to-red-500'
            }));

            loader.classList.add('hidden');
            contenido.classList.remove('hidden');
        } catch (error) {
            console.error('Error al desplegar gráficos analíticos:', error);
            loader.textContent = t('estadisticas.errorRender');
        }
    }

    await cargarAnaliticas();
    return container;
}