import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaHistorial } from './modules/FilaHistorial.js';

export async function renderHistorial() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Historial de Pedidos</h1>
            <p class="text-xs text-slate-400 mt-1">Registro de órdenes completadas o canceladas dentro del conjunto residencial.</p>
        </header>

        <section class="bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div class="p-4 bg-slate-900/40 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>⏳</span> Órdenes Archivadas
                </h2>
                
                <!-- Formulario Inline de Filtro por Fechas -->
                <form id="form-filtro-fechas" class="flex flex-wrap items-center gap-3 bg-slate-900/60 p-2 border border-slate-800/80 rounded-xl">
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-500">Desde</label>
                        <input type="date" id="filtro-desde" class="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-wider font-bold text-slate-500">Hasta</label>
                        <input type="date" id="filtro-hasta" class="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-cyan-500 font-mono">
                    </div>
                    <button type="submit" class="bg-slate-800 hover:bg-cyan-600 border border-slate-700 hover:border-cyan-500 text-white font-bold px-3 py-1 rounded-lg text-xs transition">
                        Filtrar
                    </button>
                    <button type="button" id="btn-limpiar-filtro" class="text-slate-500 hover:text-slate-300 text-xs px-1">
                        ✕
                    </button>
                </form>

                <span id="contador-historial" class="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">0 pedidos</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr class="border-b border-slate-800 bg-slate-950/20 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                            <th class="p-4">Pedido</th>
                            <th class="p-4">Residente</th>
                            <th class="p-4">Ubicación</th>
                            <th class="p-4">Productos</th>
                            <th class="p-4 text-right">Total</th>
                            <th class="p-4 text-center">Pago</th>
                            <th class="p-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo" class="divide-y divide-slate-900">
                        <tr><td colspan="7" class="text-center py-12 text-slate-500 text-xs">Cargando historial...</td></tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;

    const formFiltro = container.querySelector('#form-filtro-fechas');
    const inputDesde = container.querySelector('#filtro-desde');
    const inputHasta = container.querySelector('#filtro-hasta');
    const btnLimpiar = container.querySelector('#btn-limpiar-filtro');
    const tbody = container.querySelector('#tabla-cuerpo');
    const contador = container.querySelector('#contador-historial');

    // Consumo del nuevo endpoint limpio /historial con soporte query opcional
    async function cargarHistorial(desde = '', hasta = '') {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-500 text-xs animate-pulse">Filtrando registros...</td></tr>`;

        try {
            let ruta = '/historial';
            if (desde && hasta) {
                ruta += `?desde=${desde}&hasta=${hasta}`;
            }

            // El backend ya devuelve únicamente los pedidos filtrados y listos para pintar
            const archivados = await api.get(ruta);

            contador.textContent = `${archivados.length} pedido${archivados.length !== 1 ? 's' : ''}`;
            tbody.innerHTML = '';

            if (archivados.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-500 text-xs">No hay registros históricos para este criterio.</td></tr>`;
                return;
            }

            archivados.forEach(pedido => {
                tbody.appendChild(FilaHistorial({ pedido }));
            });
        } catch (error) {
            showToast('Error al cargar los registros del historial.', 'error');
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-red-400 text-xs">⚠️ Fallo de conexión con el módulo analítico.</td></tr>`;
        }
    }

    formFiltro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const desde = inputDesde.value;
        const hasta = inputHasta.value;

        if (!desde || !hasta) {
            showToast('Por favor, selecciona el rango de fechas completo.', 'info');
            return;
        }

        if (new Date(desde) > new Date(hasta)) {
            showToast('La fecha de inicio no puede superar a la fecha final.', 'error');
            return;
        }

        await cargarHistorial(desde, hasta);
    });

    btnLimpiar.addEventListener('click', async () => {
        formFiltro.reset();
        await cargarHistorial();
    });

    // Carga inicial sin filtros al renderizar por primera vez
    await cargarHistorial();
    return container;
}