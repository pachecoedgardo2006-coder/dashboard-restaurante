import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaHistorial } from './modules/FilaHistorial.js';

export async function renderHistorial() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto px-4 py-8 bg-slate-50 min-h-screen';

    container.innerHTML = `
        <header class="border-b border-slate-200 pb-4">
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 uppercase">Historial de Pedidos</h1>
            <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Auditoría de comandas despachadas o canceladas en parrilla.</p>
        </header>

        <section class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-center">
                <h2 class="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"> Órdenes Archivadas
                </h2>
                
                <!-- Formulario Urbano de Filtro por Fechas -->
                <form id="form-filtro-fechas" class="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg">
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-widest font-black text-slate-400">Desde</label>
                        <input type="date" id="filtro-desde" class="bg-slate-50 border border-slate-300 text-slate-700 px-2 py-1 text-xs focus:outline-none focus:border-rojo-fuego font-mono uppercase rounded">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-widest font-black text-slate-400">Hasta</label>
                        <input type="date" id="filtro-hasta" class="bg-slate-50 border border-slate-300 text-slate-700 px-2 py-1 text-xs focus:outline-none focus:border-rojo-fuego font-mono uppercase rounded">
                    </div>
                    <button type="submit" class="bg-rojo-fuego hover:bg-red-700 text-white font-black px-4 py-1 text-xs transition uppercase tracking-wider cursor-pointer rounded">
                        Filtrar
                    </button>
                    <button type="button" id="btn-limpiar-filtro" class="text-slate-400 hover:text-rojo-fuego text-xs px-1 font-bold cursor-pointer transition">
                        ✕
                    </button>
                </form>

                <span id="contador-historial" class="text-xs font-mono bg-slate-50 px-3 py-1 text-amber-600 border border-slate-200 font-bold rounded">0 PEDIDOS</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest">
                            <th class="p-4">Pedido</th>
                            <th class="p-4">Residente</th>
                            <th class="p-4">Ubicación</th>
                            <th class="p-4">Productos</th>
                            <th class="p-4 text-right">Total</th>
                            <th class="p-4 text-center">Pago</th>
                            <th class="p-4 text-center">Estado</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo" class="divide-y divide-slate-100">
                        <tr><td colspan="7" class="text-center py-12 text-slate-400 text-xs uppercase font-bold tracking-wider">Cargando bitácora de parrilla...</td></tr>
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

    async function cargarHistorial(desde = '', hasta = '') {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-rojo-fuego text-xs animate-pulse font-bold uppercase tracking-wider">Filtrando registros de carbón...</td></tr>`;

        try {
            let ruta = '/historial';
            if (desde && hasta) {
                ruta += `?desde=${desde}&hasta=${hasta}`;
            }

            const archivados = await api.get(ruta);

            contador.textContent = `${archivados.length} PEDIDO${archivados.length !== 1 ? 'S' : ''}`;
            tbody.innerHTML = '';

            if (archivados.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-400 text-xs uppercase font-bold tracking-wider">No hay registros bajo este rango.</td></tr>`;
                return;
            }

            archivados.forEach(pedido => {
                tbody.appendChild(FilaHistorial({ pedido }));
            });
        } catch (error) {
            showToast('Error al cargar la bitácora del historial.', 'error');
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-rojo-fuego text-xs font-bold uppercase tracking-wider">⚠️ Fallo crítico de comunicación con el servidor.</td></tr>`;
        }
    }

    formFiltro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const desde = inputDesde.value;
        const hasta = inputHasta.value;

        if (!desde || !hasta) {
            showToast('Selecciona el rango de fechas completo.', 'info');
            return;
        }

        if (new Date(desde) > new Date(hasta)) {
            showToast('La fecha de inicio no puede ser posterior a la final.', 'error');
            return;
        }

        await cargarHistorial(desde, hasta);
    });

    btnLimpiar.addEventListener('click', async () => {
        formFiltro.reset();
        await cargarHistorial();
    });

    await cargarHistorial();
    return container;
}