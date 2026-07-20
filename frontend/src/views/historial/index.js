import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaHistorial } from './modules/FilaHistorial.js';
import { t } from '../../i18n/i18n.js';

export async function renderHistorial() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto px-4 py-8 bg-slate-50 min-h-screen';

    container.innerHTML = `
        <header class="border-b border-slate-200 pb-4">
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 uppercase">${t('historial.titulo')}</h1>
            <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">${t('historial.subtitulo')}</p>
        </header>

        <section class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div class="p-4 bg-slate-50 border-b border-slate-200 flex flex-col xl:flex-row gap-4 justify-between items-center">
                <h2 class="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"> ${t('historial.ordenesArchivadas')}
                </h2>
                
                <!-- Formulario de Filtro por Fechas -->
                <form id="form-filtro-fechas" class="flex flex-wrap items-center gap-3 bg-white p-2 border border-slate-200 rounded-lg">
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-widest font-black text-slate-400">${t('historial.desde')}</label>
                        <input type="date" id="filtro-desde" class="bg-slate-50 border border-slate-300 text-slate-700 px-2 py-1 text-xs focus:outline-none focus:border-rojo-fuego font-mono uppercase rounded">
                    </div>
                    <div class="flex items-center gap-2">
                        <label class="text-[10px] uppercase tracking-widest font-black text-slate-400">${t('historial.hasta')}</label>
                        <input type="date" id="filtro-hasta" class="bg-slate-50 border border-slate-300 text-slate-700 px-2 py-1 text-xs focus:outline-none focus:border-rojo-fuego font-mono uppercase rounded">
                    </div>
                    <button type="submit" class="bg-rojo-fuego hover:bg-red-700 text-white font-black px-4 py-1 text-xs transition uppercase tracking-wider cursor-pointer rounded">
                        ${t('historial.filtrar')}
                    </button>
                    <button type="button" id="btn-limpiar-filtro" class="text-slate-400 hover:text-rojo-fuego text-xs px-1 font-bold cursor-pointer transition">
                        ✕
                    </button>
                </form>

                <span id="contador-historial" class="text-xs font-mono bg-slate-50 px-3 py-1 text-amber-600 border border-slate-200 font-bold rounded">${t('historial.pedidoCount', { count: 0, plural: 'S' })}</span>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm border-collapse">
                    <thead>
                        <tr class="border-b border-slate-200 bg-slate-50 text-slate-500 font-black text-xs uppercase tracking-widest">
                            <th class="p-4">${t('historial.colPedido')}</th>
                            <th class="p-4">${t('historial.colResidente')}</th>
                            <th class="p-4">${t('historial.colUbicacion')}</th>
                            <th class="p-4">${t('historial.colProductos')}</th>
                            <th class="p-4 text-right">${t('historial.colTotal')}</th>
                            <th class="p-4 text-center">${t('historial.colPago')}</th>
                            <th class="p-4 text-center">${t('historial.colEstado')}</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-cuerpo" class="divide-y divide-slate-100">
                        <tr><td colspan="7" class="text-center py-12 text-slate-400 text-xs uppercase font-bold tracking-wider">${t('historial.cargando')}</td></tr>
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
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-rojo-fuego text-xs animate-pulse font-bold uppercase tracking-wider">${t('historial.filtrando')}</td></tr>`;

        try {
            let ruta = '/historial';
            if (desde && hasta) {
                ruta += `?desde=${desde}&hasta=${hasta}`;
            }

            const archivados = await api.get(ruta);

            contador.textContent = t('historial.pedidoCount', { count: archivados.length, plural: archivados.length !== 1 ? 'S' : '' });
            tbody.innerHTML = '';

            if (archivados.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-12 text-slate-400 text-xs uppercase font-bold tracking-wider">${t('historial.sinRegistros')}</td></tr>`;
                return;
            }

            archivados.forEach(pedido => {
                tbody.appendChild(FilaHistorial({ pedido }));
            });
        } catch (error) {
            showToast(t('historial.toastErrorCarga'), 'error');
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-rojo-fuego text-xs font-bold uppercase tracking-wider">${t('historial.errorCritico')}</td></tr>`;
        }
    }

    formFiltro.addEventListener('submit', async (e) => {
        e.preventDefault();
        const desde = inputDesde.value;
        const hasta = inputHasta.value;

        if (!desde || !hasta) {
            showToast(t('historial.toastFechasIncompletas'), 'info');
            return;
        }

        if (new Date(desde) > new Date(hasta)) {
            showToast(t('historial.toastFechaInvalida'), 'error');
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