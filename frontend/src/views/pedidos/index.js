import api from '../../services/api.js';
import { FormPedido } from '../../components/FormPedido.js';
import { TarjetaPedido } from '../../components/TarjetaPedido.js';
import { showToast } from '../../components/Toast.js';

export async function renderPedidos() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Gestión de Pedidos</h1>
            <p class="text-xs text-slate-400 mt-1">Registro interno y monitoreo en tiempo real para el conjunto residencial.</p>
        </header>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <section class="lg:col-span-5 bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h2 class="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2"><span>📝</span> Registrar Nuevo Pedido</h2>
                <div id="form-slot"></div>
            </section>
            
            <section class="lg:col-span-7 space-y-4">
                <h2 class="text-lg font-bold text-amber-400 flex items-center gap-2"><span>🔥</span> Pedidos Activos (Monitoreo)</h2>
                <div id="contenedor-tarjetas" class="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max items-start"></div>
            </section>
        </div>
    `;

    let productosDisponibles = [];

    async function inicializarVista() {
        try {
            productosDisponibles = await api.get('/inventario');
            montarFormulario();
            await cargarTarjetasActivas();
        } catch (error) {
            showToast('Error al inicializar la vista de pedidos.', 'error');
        }
    }

    function montarFormulario() {
        const slot = container.querySelector('#form-slot');
        slot.innerHTML = '';
        
        slot.appendChild(FormPedido({
            productosDisponibles,
            onGuardarPedido: async (payload) => {
                try {
                    await api.post('/pedidos', { ...payload, fecha: new Date().toISOString() });
                    showToast('¡Pedido despachado con éxito!', 'success');
                    
                    productosDisponibles = await api.get('/inventario');
                    montarFormulario();
                    await cargarTarjetasActivas();
                } catch (error) {
                    const msgError = error.response?.data?.error || 'Verifique stocks o red.';
                    showToast(`Error: ${msgError}`, 'error');
                }
            }
        }));
    }

    async function cargarTarjetasActivas() {
        const tarjetasContainer = container.querySelector('#contenedor-tarjetas');
        tarjetasContainer.innerHTML = '';

        try {
            const todosLosPedidos = await api.get('/pedidos');
            const activos = todosLosPedidos.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación');

            if (activos.length === 0) {
                tarjetasContainer.innerHTML = `<div class="col-span-full text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">No hay pedidos activos.</div>`;
                return;
            }

            activos.forEach(pedido => {
                tarjetasContainer.appendChild(TarjetaPedido({
                    pedido,
                    onCambiarEstado: async (id, nuevoEstado) => {
                        try {
                            await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
                            showToast(`Pedido #${id} actualizado a ${nuevoEstado}`, 'info');
                            
                            productosDisponibles = await api.get('/inventario');
                            montarFormulario();
                            await cargarTarjetasActivas();
                        } catch (error) {
                            showToast('Error modificando el estado del pedido.', 'error');
                        }
                    }
                }));
            });
        } catch (error) {
            showToast('Error al cargar el panel de monitoreo.', 'error');
        }
    }

    await inicializarVista();
    return container;
}