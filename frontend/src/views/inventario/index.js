import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaProducto } from './modules/FilaProducto.js';
import { FormInventario } from './modules/FormInventario.js';

export async function renderInventario() {
    const container = document.createElement('div');
    container.className = 'p-6 space-y-8 bg-slate-900 text-slate-100 min-h-screen';

    container.innerHTML = `
        <header class="border-b border-slate-800 pb-4 flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight text-white">Auditoría de Inventario</h1>
                <p class="text-sm text-slate-400 mt-1">Control atómico de unidades de insumos y platos del restaurante.</p>
            </div>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <!-- Tabla Dinámica (Izquierda) -->
            <div class="xl:col-span-3 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                            <th class="py-3 px-4">ID</th>
                            <th class="py-3 px-4">Nombre / Plato</th>
                            <th class="py-3 px-4">Descripción</th>
                            <th class="py-3 px-4">Precio Base</th>
                            <th class="py-3 px-4">Stock Disponible</th>
                            <th class="py-3 px-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-productos-body" class="divide-y divide-slate-800/40 text-sm"></tbody>
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
                    showToast('Producto actualizado con éxito', 'success');
                } else {
                    await api.post('/inventario', datosProducto);
                    showToast('Nuevo producto guardado en catálogo', 'success');
                }
                compFormulario.resetearFormulario();
                await refrescarTabla();
            } catch (error) {
                showToast('Error al salvar el producto en la base de datos.', 'error');
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
                        <td colspan="6" class="text-center py-8 text-slate-500 text-xs">No hay productos en inventario.</td>
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
            showToast('Error al cargar productos del inventario.', 'error');
        }
    }

    await refrescarTabla();
    return container;
}