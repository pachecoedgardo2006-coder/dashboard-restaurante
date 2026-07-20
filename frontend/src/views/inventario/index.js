import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaProducto } from './modules/FilaProducto.js';
import { FormInventario } from './modules/FormInventario.js';
import { t } from '../../i18n/i18n.js';

export async function renderInventario() {
    const container = document.createElement('div');
    container.className = 'p-6 space-y-8 bg-slate-950 text-slate-100 min-h-screen px-4';

    container.innerHTML = `
        <header class="border-b border-slate-900 pb-4 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-black tracking-tighter text-white uppercase">${t('inventario.titulo')}</h1>
                <p class="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">${t('inventario.subtitulo')}</p>
            </div>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <!-- Tabla Dinámica (Izquierda) -->
            <div class="xl:col-span-3 bg-slate-950 border border-slate-900 rounded-none p-6 shadow-2xl overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-900 text-xs text-slate-400 font-black uppercase tracking-widest bg-slate-900/40">
                            <th class="py-3 px-4">${t('inventario.colId')}</th>
                            <th class="py-3 px-4">${t('inventario.colNombre')}</th>
                            <th class="py-3 px-4">${t('inventario.colDescripcion')}</th>
                            <th class="py-3 px-4">${t('inventario.colPrecio')}</th>
                            <th class="py-3 px-4">${t('inventario.colStock')}</th>
                            <th class="py-3 px-4 text-right">${t('inventario.colAccion')}</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-productos-body" class="divide-y divide-slate-900 text-sm"></tbody>
                </table>
            </div>

            <!-- Slot donde se inyectará el Formulario Modular (Derecha) -->
            <div id="form-slot-inventario"></div>
        </div>
    `;

    const tbody = container.querySelector('#tabla-productos-body');
    const formSlot = container.querySelector('#form-slot-inventario');

    // Instanciamos el componente de manera aislada
    const compFormulario = FormInventario({
        onGuardar: async (payload) => {
            const { id, ...datosProducto } = payload;
            try {
                if (id) {
                    await api.put(`/inventario/${id}`, datosProducto);
                    showToast(t('inventario.form.toastActualizado'), 'success');
                } else {
                    await api.post('/inventario', datosProducto);
                    showToast(t('inventario.form.toastGuardado'), 'success');
                }
                compFormulario.resetearFormulario();
                await refrescarTabla();
            } catch (error) {
                showToast(t('inventario.form.toastErrorGuardar'), 'error');
            }
        },
        onCancelarEdicion: () => {
            // Lógica extra si decides limpiar estados de selección paralelos
        }
    });

    // Inyectamos el nodo del formulario
    formSlot.appendChild(compFormulario);

    async function refrescarTabla() {
        tbody.innerHTML = '';
        try {
            const productos = await api.get('/inventario');

            if (productos.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-8 text-slate-500 text-xs uppercase font-black tracking-widest">${t('inventario.sinProductos')}</td>
                    </tr>
                `;
                return;
            }

            productos.forEach(p => {
                const fila = FilaProducto({
                    producto: p,
                    onEditar: (productoSeleccionado) => {
                        // Invocamos la función interna del componente para cargar los datos
                        compFormulario.cargarProductoParaEdicion(productoSeleccionado);
                    }
                });
                tbody.appendChild(fila);
            });
        } catch (error) {
            console.error('Error al cargar la tabla de inventario:', error);
            showToast(t('inventario.toastErrorCargarTabla'), 'error');
        }
    }

    await refrescarTabla();
    return container;
}