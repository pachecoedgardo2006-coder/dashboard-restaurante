import api from '../../services/api.js';
import { FormPedido } from '../../components/FormPedido.js';
import { TarjetaPedido } from '../../components/TarjetaPedido.js';
import { showToast } from '../../components/Toast.js';
import { t } from '../../i18n/i18n.js';

export async function renderPedidos() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto px-4 py-8 bg-slate-50 min-h-screen';

    container.innerHTML = `
        <header class="border-b border-slate-200 pb-4">
            <h1 class="text-3xl font-black tracking-tighter text-slate-900 uppercase">${t('pedidos.titulo')}</h1>
            <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">${t('pedidos.subtitulo')}</p>
        </header> 
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Sección de Despacho (Formulario) -->
            <section class="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h2 class="text-sm font-black mb-5 text-rojo-fuego uppercase tracking-widest flex items-center gap-2"> ${t('pedidos.seccionCreacion')}
                </h2>
                <div id="form-slot"></div>
            </section>
        <!-- Sección de Monitoreo Activo (Tarjetas) -->
            <section class="lg:col-span-7 space-y-4">
                <h2 class="text-sm font-black text-amber-600 uppercase tracking-widest flex items-center gap-2"> ${t('pedidos.seccionMonitoreo')}
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
            showToast(t('pedidos.toastInitError'), 'error');
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
                    showToast(t('pedidos.toastGuardadoExito'), 'success');
                    
                    // Sincronización estricta de UI y persistencia real
                    productosDisponibles = await api.get('/inventario');
                    montarFormulario();
                    await cargarTarjetasActivas();
                } catch (error) {
                    const msgError = error.response?.data?.error || t('pedidos.toastGuardadoErrorFallback');
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
                    <div class="col-span-full text-center py-16 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs uppercase font-black tracking-widest">
                        ${t('pedidos.vacio')}
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
                            showToast(t('pedidos.toastEstadoCambiado', { id, estado: t(`estados.${nuevoEstado}`).toUpperCase() }), 'info');
                            
                            // Mutación inmediata y actualización del inventario/stock remanente
                            productosDisponibles = await api.get('/inventario');
                            montarFormulario();
                            await cargarTarjetasActivas();
                        } catch (error) {
                            showToast(t('pedidos.toastEstadoError'), 'error');
                        }
                    }
                }));
            });
        } catch (error) {
            showToast(t('pedidos.toastConexionError'), 'error');
        }
    }

    await inicializarVista();
    return container;
}