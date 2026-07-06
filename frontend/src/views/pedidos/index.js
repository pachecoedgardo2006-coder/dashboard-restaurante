import api from '../../services/api.js';
import { FormPedido } from '../../components/FormPedido.js';
import { TarjetaPedido } from '../../components/TarjetaPedido.js';
import { showToast } from '../../components/Toast.js';

export async function renderPedidos() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto px-4';

    container.innerHTML = `
        <header class="border-b border-slate-900 pb-4">
            <h1 class="text-3xl font-black tracking-tighter text-white uppercase">Gestión de Pedidos</h1>
            <p class="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Comandero interno y monitoreo de brasas en tiempo real.</p>
        </header> 
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Sección de Despacho (Formulario) -->
            <section class="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-none p-5 shadow-2xl">
                <h2 class="text-sm font-black mb-5 text-rojo-fuego uppercase tracking-widest flex items-center gap-2"> CREACIÓN DE PEDIDOS
                </h2>
                <div id="form-slot"></div>
            </section>
        <!-- Sección de Monitoreo Activo (Tarjetas) -->
            <section class="lg:col-span-7 space-y-4">
                <h2 class="text-sm font-black text-mostaza-caliente uppercase tracking-widest flex items-center gap-2"> Monitoreo en Línea (Cocina)
                </h2>
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
            showToast('Error al inicializar el panel de comandas.', 'error');
        }
    }

    function montarFormulario() {
        const slot = container.querySelector('#form-slot');
        slot.innerHTML = ''; // Ciclo de vida limpio: previene duplicidad de listeners
        
        slot.appendChild(FormPedido({
            productosDisponibles,
            onGuardarPedido: async (payload) => {
                try {
                    await api.post('/pedidos', { ...payload, fecha: new Date().toISOString() });
                    showToast('¡Pedido enviado a las brasas con éxito!', 'success');
                    
                    // Sincronización estricta de UI y persistencia real
                    productosDisponibles = await api.get('/inventario');
                    montarFormulario();
                    await cargarTarjetasActivas();
                } catch (error) {
                    const msgError = error.response?.data?.error || 'Verifique insumos o red.';
                    showToast(`Error: ${msgError}`, 'error');
                }
            }
        }));
    }

    async function cargarTarjetasActivas() {
        const tarjetasContainer = container.querySelector('#contenedor-tarjetas');
        tarjetasContainer.innerHTML = ''; // Limpieza previa del slot

        try {
            const todosLosPedidos = await api.get('/pedidos');
            // Se filtran únicamente los estados activos en cocina
            const activos = todosLosPedidos.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación');

            if (activos.length === 0) {
                tarjetasContainer.innerHTML = `
                    <div class="col-span-full text-center py-16 border-2 border-dashed border-slate-900 rounded-none text-slate-600 text-xs uppercase font-black tracking-widest">
                        Parrilla vacía. No hay pedidos activos.
                    </div>
                `;
                return;
            }

            activos.forEach(pedido => {
                tarjetasContainer.appendChild(TarjetaPedido({
                    pedido,
                    onCambiarEstado: async (id, nuevoEstado) => {
                        try {
                            await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
                            showToast(`Pedido #${id} pasó a [${nuevoEstado.toUpperCase()}]`, 'info');
                            
                            // Mutación inmediata y actualización del inventario/stock remanente
                            productosDisponibles = await api.get('/inventario');
                            montarFormulario();
                            await cargarTarjetasActivas();
                        } catch (error) {
                            showToast('Error al actualizar el estado en cocina.', 'error');
                        }
                    }
                }));
            });
        } catch (error) {
            showToast('Error al conectar con el monitor de cocina.', 'error');
        }
    }

    await inicializarVista();
    return container;
}