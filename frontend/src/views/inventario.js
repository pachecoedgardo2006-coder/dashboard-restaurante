import api from '../services/api.js';
import { showToast } from '../components/Toast.js'; // Importamos la mini pestaña flotante

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

            <!-- Formulario de Control Lateral (Derecha) -->
            <div class="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit space-y-6">
                <div>
                    <h2 id="form-titulo" class="text-lg font-bold text-cyan-400">📦 Agregar Nuevo Producto</h2>
                    <p class="text-xs text-slate-500">Introduce un nuevo plato al menú o ingrediente base.</p>
                </div>
                
                <form id="form-producto-inv" class="space-y-4" autocomplete="off">
                    <input type="hidden" id="edit-id" value="">
                    <div>
                        <label class="block text-xs font-medium text-slate-300 mb-1">Nombre Completo *</label>
                        <input type="text" id="inv-nombre" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-slate-300 mb-1">Descripción corta</label>
                        <input type="text" id="inv-descripcion" autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-slate-300 mb-1">Precio ($) *</label>
                            <input type="number" id="inv-precio" min="0" step="any" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-slate-300 mb-1">Stock Inicial *</label>
                            <input type="number" id="inv-stock" min="0" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500">
                        </div>
                    </div>
                    <div class="flex gap-2 pt-2">
                        <button type="submit" class="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg text-xs uppercase tracking-wider transition">
                            Guardar Cambios
                        </button>
                        <button type="button" id="btn-cancelar-edicion" class="hidden bg-slate-800 hover:bg-slate-700 text-slate-400 py-2 px-3 rounded-lg text-xs transition">
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const tbody = container.querySelector('#tabla-productos-body');
    const form = container.querySelector('#form-producto-inv');
    const formTitulo = container.querySelector('#form-titulo');
    const btnCancelarEdicion = container.querySelector('#btn-cancelar-edicion');

    const inputId = container.querySelector('#edit-id');
    const inputNombre = container.querySelector('#inv-nombre');
    const inputDescripcion = container.querySelector('#inv-descripcion');
    const inputPrecio = container.querySelector('#inv-precio');
    const inputStock = container.querySelector('#inv-stock');

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
                const tr = document.createElement('tr');
                tr.className = 'hover:bg-slate-900/60 transition-colors';

                const esStockBajo = p.stock <= 5;

                tr.innerHTML = `
                    <td class="py-3 px-4 font-mono text-xs text-slate-500">#${p.id}</td>
                    <td class="py-3 px-4 font-bold text-white">${p.nombre}</td>
                    <td class="py-3 px-4 text-xs text-slate-400 max-w-xs truncate">${p.descripcion || '-'}</td>
                    <td class="py-3 px-4 font-semibold text-slate-300">$${p.precio.toFixed(2)}</td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            esStockBajo ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-emerald-400'
                        }">
                            ${p.stock} u. ${esStockBajo ? '(¡Bajo!)' : ''}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                        <button class="bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 border border-slate-700 hover:border-cyan-800/50 text-xs font-semibold py-1 px-3 rounded-md transition" data-action="editar">
                            Modificar
                        </button>
                    </td>
                `;

                tr.querySelector('[data-action="editar"]').addEventListener('click', () => activarEdicion(p));
                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error('Error al cargar la tabla de inventario:', error);
            showToast('Error al cargar productos del inventario.', 'error');
        }
    }

    function activarEdicion(producto) {
        formTitulo.textContent = '✏️ Modificar Producto';
        formTitulo.className = 'text-lg font-bold text-amber-400';
        btnCancelarEdicion.classList.remove('hidden');

        inputId.value = producto.id;
        inputNombre.value = producto.nombre;
        inputDescripcion.value = producto.descripcion || '';
        inputPrecio.value = producto.precio;
        inputStock.value = producto.stock;
    }

    function resetearFormulario() {
        formTitulo.textContent = '📦 Agregar Nuevo Producto';
        formTitulo.className = 'text-lg font-bold text-cyan-400';
        btnCancelarEdicion.classList.add('hidden');
        form.reset();
        inputId.value = '';
    }

    btnCancelarEdicion.addEventListener('click', resetearFormulario);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = inputId.value;
        const payload = {
            nombre: inputNombre.value,
            descripcion: inputDescripcion.value,
            precio: parseFloat(inputPrecio.value),
            stock: parseInt(inputStock.value)
        };

        try {
            if (id) {
                await api.put(`/inventario/${id}`, payload);
                showToast('Producto actualizado con éxito', 'success'); // Reemplazo de alert
            } else {
                await api.post('/inventario', payload);
                showToast('Nuevo producto guardado en catálogo', 'success'); // Reemplazo de alert
            }
            resetearFormulario();
            await refrescarTabla();
        } catch (error) {
            showToast('Error al salvar el producto en la base de datos.', 'error'); // Reemplazo de alert
        }
    });

    await refrescarTabla();
    return container;
}