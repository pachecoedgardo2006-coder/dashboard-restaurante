import api from '../../services/api.js';
import { showToast } from '../../components/Toast.js';
import { FilaProducto } from './modules/FilaProducto.js';
import { FormInventario } from './modules/FormInventario.js';

export async function renderInventario() {
    const container = document.createElement('div');
    container.className = 'p-8 space-y-6 bg-slate-50 text-slate-900 min-h-screen';

    container.innerHTML = `
        <header class="pb-2">
            <h1 class="text-3xl font-black tracking-tight text-slate-900">Auditoría de Inventario</h1>
            <p class="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Control atómico de unidades de insumos y platos del restaurante.</p>
        </header>

        <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <!-- Tabla Dinámica (Izquierda) -->
            <div class="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-xs text-slate-500 font-bold uppercase tracking-wide bg-slate-50">
                            <th class="py-3 px-4 rounded-l-lg">ID</th>
                            <th class="py-3 px-4">Nombre/Plato</th>
                            <th class="py-3 px-4">Descripción</th>
                            <th class="py-3 px-4">Precio Base</th>
                            <th class="py-3 px-4">Stock Disponible</th>
                            <th class="py-3 px-4 text-right rounded-r-lg">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-productos-body" class="divide-y divide-slate-100 text-sm"></tbody>
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
                        <td colspan="6" class="text-center py-8 text-slate-400 text-xs uppercase font-bold tracking-widest">No hay productos en inventario.</td>
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