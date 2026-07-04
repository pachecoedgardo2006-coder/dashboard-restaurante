// frontend/src/views/historial.js
import api from '../services/api.js';
import { showToast } from '../components/Toast.js';

export async function renderHistorial() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Historial de Pedidos</h1>
            <p class="text-xs text-slate-400 mt-1">Registro de órdenes completadas o canceladas dentro del conjunto residencial.</p>
        </header>

        <!-- Filtro rápido / Card Contenedor -->
        <section class="bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div class="p-4 bg-slate-900/40 border-b border-slate-800 flex justify-between items-center">
                <h2 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <span>⏳</span> Órdenes Archivadas
                </h2>
                <span id="contador-historial" class="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">0 pedidos</span>
            </div>

            <!-- Tabla Responsiva -->
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
                        <tr>
                            <td colspan="7" class="text-center py-12 text-slate-500 text-xs">
                                Cargando historial...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;

    async function cargarHistorial() {
        const tbody = container.querySelector('#tabla-cuerpo');
        const contador = container.querySelector('#contador-historial');

        try {
            // Reutilizamos tu endpoint GET '/' de pedidos, filtrando los cerrados en la UI
            const todosLosPedidos = await api.get('/pedidos');
            const archivados = todosLosPedidos.filter(p => p.estado === 'Entregado' || p.estado === 'Cancelado');

            contador.textContent = `${archivados.length} pedido${archivados.length !== 1 ? 's' : ''}`;
            tbody.innerHTML = '';

            if (archivados.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-12 border border-dashed border-slate-900 text-slate-500 text-xs">
                            No hay registros históricos de pedidos completados o cancelados.
                        </td>
                    </tr>
                `;
                return;
            }

            archivados.forEach(pedido => {
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-900/30 transition-colors duration-150 group';

                // Formatear fecha legible
                const fecha = new Date(pedido.fecha).toLocaleDateString('es-CO', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                // Badge de Estado Estilizado (Cyberpunk Style)
                const estadoBadge = pedido.estado === 'Entregado' 
                    ? `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Entregado</span>`
                    : `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-950/40 border border-red-900/60 text-red-400">Cancelado</span>`;

                // Construcción de la lista compacta de productos
                const itemsList = pedido.items.map(item => 
                    `<span class="block text-xs text-slate-300">${item.cantidad}x ${item.nombre}</span>`
                ).join('');

                tr.innerHTML = `
                    <td class="p-4 font-mono text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                        #${pedido.id}
                        <span class="block text-[10px] text-slate-500 mt-0.5">${fecha}</span>
                    </td>
                    <td class="p-4 font-semibold text-white">
                        ${pedido.cliente_nombre}
                        <span class="block text-xs font-normal text-slate-400 mt-0.5">${pedido.telefono}</span>
                    </td>
                    <td class="p-4 text-xs text-slate-300">
                        <span class="font-bold text-slate-400">T:</span> ${pedido.torre_bloque} 
                        <span class="font-bold text-slate-400 ml-1">Apt:</span> ${pedido.apartamento}
                    </td>
                    <td class="p-4 space-y-0.5 max-w-xs truncate">
                        ${itemsList}
                    </td>
                    <td class="p-4 text-right font-mono font-bold text-slate-200">
                        $${pedido.total.toLocaleString()}
                    </td>
                    <td class="p-4 text-center text-xs">
                        <span class="text-slate-400 block">${pedido.tipo_pago}</span>
                        ${pedido.tipo_pago === 'Efectivo' ? `<span class="text-[10px] text-slate-500">Cambio: $${pedido.cambio.toLocaleString()}</span>` : ''}
                    </td>
                    <td class="p-4 text-center">
                        ${estadoBadge}
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Error al renderizar el historial:', error);
            showToast('Error al cargar los registros del historial.', 'error');
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-6 text-red-400 text-xs">
                        ⚠️ No se pudo establecer conexión con los registros.
                    </td>
                </tr>
            `;
        }
    }

    await cargarHistorial();
    return container;
}