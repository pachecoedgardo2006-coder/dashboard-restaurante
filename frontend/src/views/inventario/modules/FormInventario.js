export function FormInventario({ onGuardar, onCancelarEdicion }) {
    const container = document.createElement('div');
    container.className = 'bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit space-y-6';

    container.innerHTML = `
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
    `;

    const form = container.querySelector('#form-producto-inv');
    const formTitulo = container.querySelector('#form-titulo');
    const btnCancelar = container.querySelector('#btn-cancelar-edicion');

    const inputId = container.querySelector('#edit-id');
    const inputNombre = container.querySelector('#inv-nombre');
    const inputDescripcion = container.querySelector('#inv-descripcion');
    const inputPrecio = container.querySelector('#inv-precio');
    const inputStock = container.querySelector('#inv-stock');

    // Método expuesto para activar el modo de edición desde la vista externa
    container.cargarProductoParaEdicion = (producto) => {
        formTitulo.textContent = '✏️ Modificar Producto';
        formTitulo.className = 'text-lg font-bold text-amber-400';
        btnCancelar.classList.remove('hidden');

        inputId.value = producto.id;
        inputNombre.value = producto.nombre;
        inputDescripcion.value = producto.descripcion || '';
        inputPrecio.value = producto.precio;
        inputStock.value = producto.stock;
    };

    // Método expuesto para limpiar el formulario y volver al modo Agregar
    container.resetearFormulario = () => {
        formTitulo.textContent = '📦 Agregar Nuevo Producto';
        formTitulo.className = 'text-lg font-bold text-cyan-400';
        btnCancelar.classList.add('hidden');
        form.reset();
        inputId.value = '';
    };

    btnCancelar.addEventListener('click', () => {
        container.resetearFormulario();
        if (onCancelarEdicion) onCancelarEdicion();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const payload = {
            id: inputId.value || null,
            nombre: inputNombre.value,
            descripcion: inputDescripcion.value,
            precio: parseFloat(inputPrecio.value),
            stock: parseInt(inputStock.value)
        };

        onGuardar(payload);
    });

    return container;
}