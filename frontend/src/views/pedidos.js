// frontend/src/views/pedidos.js
import api from '../services/api.js';
import { FormPedido } from '../components/FormPedido.js';
import { TarjetaPedido } from '../components/TarjetaPedido.js';
import { showToast } from '../components/Toast.js'; // Importamos la mini pestaña flotante

export async function renderPedidos() {
    const container = document.createElement('div');
    container.className = 'space-y-6 w-full max-w-7xl mx-auto'; // Centrado y con max-w para evitar estiramientos amorfos

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4">
            <h1 class="text-2xl font-black tracking-tight text-white sm:text-3xl">Gestión de Pedidos</h1>
            <p class="text-xs text-slate-400 mt-1">Registro interno y monitoreo en tiempo real para el conjunto residencial.</p>
        </header>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Contenedor del Formulario Modular -->
            <section class="lg:col-span-5 bg-slate-950/40 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl" id="wrapper-form-componente">
                <h2 class="text-lg font-bold mb-4 text-emerald-400 flex items-center gap-2">
                    <span>📝</span> Registrar Nuevo Pedido
                </h2>
                <div id="form-slot"></div>
            </section>
            
            <!-- Panel de Pedidos Activos -->
            <section class="lg:col-span-7 space-y-4">
                <h2 class="text-lg font-bold text-amber-400 flex items-center gap-2">
                    <span>🔥</span> Pedidos Activos (Monitoreo)
                </h2>
                <!-- auto-rows-max e items-start para que las tarjetas no colapsen entre sí -->
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
            console.error('Error al inicializar la vista de pedidos:', error);
            showToast('Error al conectar con el servidor', 'error');
        }
    }

    function montarFormulario() {
        const slot = container.querySelector('#form-slot');
        slot.innerHTML = '';
        
        const formulario = FormPedido({
            productosDisponibles,
            onGuardarPedido: async (payload) => {
                try {
                    await api.post('/pedidos', { ...payload, fecha: new Date().toISOString() });
                    // Reemplazo de alert por una notificación flotante de éxito
                    showToast('¡Pedido despachado con éxito!', 'success');
                    
                    // Recargar estado local de forma limpia
                    productosDisponibles = await api.get('/inventario');
                    montarFormulario();
                    await cargarTarjetasActivas();
                } catch (error) {
                    console.error("Error detallado del backend:", error.response?.data || error.message);
                    // Reemplazo de alert por notificación de error dinámica
                    const msgError = error.response?.data?.error || 'Verifique stocks o red.';
                    showToast(`Error al registrar pedido: ${msgError}`, 'error');
                }
            }
        });
        slot.appendChild(formulario);
    }

    async function cargarTarjetasActivas() {
        const tarjetasContainer = container.querySelector('#contenedor-tarjetas');
        tarjetasContainer.innerHTML = '';

        try {
            const todosLosPedidos = await api.get('/pedidos');
            const activos = todosLosPedidos.filter(p => p.estado === 'Pendiente' || p.estado === 'En preparación');

            if (activos.length === 0) {
                tarjetasContainer.innerHTML = `
                    <div class="col-span-full text-center py-12 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                        No hay pedidos en preparación o pendientes en este momento.
                    </div>
                `;
                return;
            }

            activos.forEach(pedido => {
                const tarjeta = TarjetaPedido({
                    pedido,
                    onCambiarEstado: async (id, nuevoEstado) => {
                        try {
                            await api.put(`/pedidos/${id}`, { estado: nuevoEstado });
                            // Notificación sutil de que el estado cambió correctamente
                            showToast(`Pedido #${id} actualizado a ${nuevoEstado}`, 'info');
                            
                            // Re-renderizar todo el ecosistema al mutar un estado
                            productosDisponibles = await api.get('/inventario');
                            montarFormulario();
                            await cargarTarjetasActivas();
                        } catch (error) {
                            // Reemplazo de alert por notificación de error
                            showToast('Error modificando el estado del pedido.', 'error');
                        }
                    }
                });
                tarjetasContainer.appendChild(tarjeta);
            });
        } catch (error) {
            console.error('Error al pintar pedidos activos:', error);
            showToast('Error al cargar el panel de monitoreo.', 'error');
        }
    }

    await inicializarVista();
    return container;
}