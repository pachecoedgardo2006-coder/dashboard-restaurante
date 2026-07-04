// frontend/src/views/estadisticas.js
import api from '../services/api.js';

// --- SUB-COMPONENTE MODULAR: CARD METRICA ---
function CardMetrica({ titulo, valor, icono, colorClase, bgIconoClase }) {
    const card = document.createElement('div');
    card.className = 'bg-linear-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between min-w-0';
    card.innerHTML = `
        <div class="min-w-0 flex-1 pr-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">${titulo}</p>
            <h3 class="text-2xl font-black ${colorClase} mt-2 truncate">${valor}</h3>
        </div>
        <span class="text-2xl ${bgIconoClase} p-3 rounded-xl border shrink-0">${icono}</span>
    `;
    return card;
}

// --- SUB-COMPONENTE MODULAR: GRÁFICO DE BARRAS SEMÁNTICO ---
function GraficoProgreso({ titulo, descripcion, items, deColor, aColor }) {
    const container = document.createElement('div');
    container.className = 'bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4';
    container.innerHTML = `
        <div>
            <h2 class="text-base font-bold text-white">${titulo}</h2>
            <p class="text-xs text-slate-500">${descripcion}</p>
        </div>
        <div class="space-y-4 pt-2" id="items-container"></div>
    `;

    const itemsContainer = container.querySelector('#items-container');
    if (!items || items.length === 0) {
        itemsContainer.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">Sin datos críticos para reportar.</p>`;
        return container;
    }

    const maxVal = Math.max(...items.map(i => i.valor), 1);

    items.forEach(item => {
        const porcentaje = (item.valor / maxVal) * 100;
        const row = document.createElement('div');
        row.className = 'space-y-1';
        row.innerHTML = `
            <div class="flex justify-between text-xs gap-4">
                <span class="font-bold text-slate-200 truncate">${item.nombre}</span>
                <span class="text-slate-400 font-medium shrink-0">${item.etiquetaValor}</span>
            </div>
            <div class="w-full bg-slate-900 rounded-lg h-2.5 overflow-hidden">
                <div class="bg-linear-to-r ${deColor} ${aColor} h-2.5 rounded-lg transition-all duration-700" style="width: 0%"></div>
            </div>
        `;
        
        setTimeout(() => {
            const bar = row.querySelector('.bg-linear-to-r');
            if (bar) bar.style.width = `${porcentaje}%`;
        }, 50);

        itemsContainer.appendChild(row);
    });

    return container;
}

// --- SUB-COMPONENTE: SECCIÓN CONTENEDORA ---
function CrearSeccionAnalitica({ titulo, descripcion }) {
    const section = document.createElement('section');
    section.className = 'space-y-3';
    section.innerHTML = `
        <div class="border-l-2 border-slate-800 pl-3">
            <h2 class="text-sm font-bold text-slate-200 tracking-wide uppercase">${titulo}</h2>
            <p class="text-xs text-slate-500 mt-0.5">${descripcion}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 id-grid-cards"></div>
    `;
    return section;
}

// --- ORQUESTADOR PRINCIPAL DE LA VISTA (SPA) ---
export async function renderEstadisticas() {
    const container = document.createElement('div');
    container.className = 'space-y-8 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Métricas de Rendimiento</h1>
            <p class="text-xs text-slate-400 mt-1">Resumen financiero, logístico y residencial mapeado en tiempo real.</p>
        </header>

        <!-- Loader Atómico -->
        <div id="loader-estadisticas" class="text-center py-12 text-slate-400 text-xs animate-pulse">
            Compilando analíticas avanzadas desde base de datos...
        </div>

        <div id="contenido-estadisticas" class="hidden space-y-8">
            <!-- Bloque Dinámico para las Secciones de Tarjetas -->
            <div id="contenedor-secciones" class="space-y-8"></div>

            <!-- Sección de Gráficos Avanzados -->
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

            // Definición de las secciones estructuradas y sus respectivas tarjetas
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

            // Renderizar las secciones de tarjetas de control
            seccionesConfig.forEach(sec => {
                const nuevaSeccion = CrearSeccionAnalitica({ titulo: sec.titulo, descripcion: sec.descripcion });
                const gridCards = nuevaSeccion.querySelector('.id-grid-cards');

                sec.metrics.forEach(m => {
                    gridCards.appendChild(CardMetrica({
                        titulo: m.titulo,
                        valor: m.valor,
                        icono: m.icono,
                        colorClase: m.color,
                        bgIconoClase: m.bgIcono
                    }));
                });

                contenedorSecciones.appendChild(nuevaSeccion);
            });

            // 2. Gráfica 1: Top Alimentos Menú[cite: 3]
            const itemsMenu = (data.productos_mas_vendidos || []).map(p => ({
                nombre: p.nombre,
                valor: p.total_vendido,
                etiquetaValor: `${p.total_vendido} u.`
            }));
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🔥 Top de Ventas en el Menú',
                descripcion: 'Platos con mayor índice de rotación dentro del conjunto.',
                items: itemsMenu,
                deColor: 'from-cyan-500',
                aColor: 'to-blue-600'
            }));

            // 3. Gráfica 2: Ranking de Clientes Frecuentes[cite: 3]
            const itemsClientes = (data.clientes_frecuentes || []).map(c => ({
                nombre: c.cliente_nombre,
                valor: c.total_pedidos,
                etiquetaValor: `${c.total_pedidos} órdenes`
            }));
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '👑 Clientes Frecuentes',
                descripcion: 'Residentes con mayor frecuencia de compra registrada.',
                items: itemsClientes,
                deColor: 'from-purple-500',
                aColor: 'to-pink-600'
            }));

            // 4. Gráfica 3: Demanda por Torres/Bloques del Conjunto[cite: 3]
            const itemsTorres = (data.ranking_torres || []).map(t => ({
                nombre: `Torre / Bloque ${t.torre_bloque}`,
                valor: t.total_pedidos,
                etiquetaValor: `${t.total_pedidos} ped.`
            }));
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🏢 Flujo de Pedidos por Torre',
                descripcion: 'Volumen operativo distribuido geográficamente en el conjunto.',
                items: itemsTorres,
                deColor: 'from-amber-500',
                aColor: 'to-orange-600'
            }));

            // 5. Gráfica 4: Alerta Crítica de Stock Mínimo[cite: 3]
            const itemsStock = (data.stock_critico || []).map(s => ({
                nombre: s.nombre,
                valor: s.stock === 0 ? 0.1 : s.stock, 
                etiquetaValor: `${s.stock} unidades`
            }));
            gridGraficos.appendChild(GraficoProgreso({
                titulo: '🚨 Alerta de Inventario Crítico',
                descripcion: 'Insumos y platos con stock igual o inferior a 10 unidades.',
                items: itemsStock,
                deColor: 'from-red-500',
                aColor: 'to-rose-700'
            }));

            // Apagar loader y liberar vista armada[cite: 3]
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