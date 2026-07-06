export function FormInventario({ onGuardar, onCancelarEdicion }) {
    const container = document.createElement('div');
    container.className = 'bg-slate-950 border border-slate-900 rounded-none p-6 shadow-2xl h-fit space-y-6';

    container.innerHTML = `
        <div>
            <h2 id="form-titulo" class="text-sm font-black text-rojo-fuego uppercase tracking-widest">📦 Agregar Nuevo Producto</h2>
            <p class="text-[11px] text-slate-500 uppercase tracking-wider font-bold mt-1">Introduce un nuevo plato al menú o ingrediente base.</p>
        </div>
        
        <form id="form-producto-inv" class="space-y-4" autocomplete="off">
            <input type="hidden" id="edit-id" value="">
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nombre Completo *</label>
                <input type="text" id="inv-nombre" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-rojo-fuego uppercase tracking-wide">
            </div>
            <div>
                <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Descripción corta</label>
                <input type="text" id="inv-descripcion" autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-rojo-fuego uppercase tracking-wide">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Precio ($) *</label>
                    <input type="number" id="inv-precio" min="0" step="any" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-rojo-fuego font-mono">
                </div>
                <div>
                    <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Inicial *</label>
                    <input type="number" id="inv-stock" min="0" required autocomplete="off" class="w-full bg-slate-900 border border-slate-800 rounded-none px-3 py-2 text-sm text-white focus:outline-none focus:border-rojo-fuego font-mono">
                </div>
            </div>
            <div class="flex gap-2 pt-2">
                <button type="submit" class="flex-1 bg-rojo-fuego hover:bg-red-700 text-white font-black py-2 px-4 rounded-none text-xs uppercase tracking-wider transition cursor-pointer">
                    Guardar Cambios
                </button>
                <button type="button" id="btn-cancelar-edicion" class="hidden bg-slate-900 hover:bg-slate-800 text-slate-400 py-2 px-3 rounded-none text-xs transition font-black uppercase tracking-wider cursor-pointer border border-slate-800">
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
        formTitulo.textContent = 'Modificar Producto';
        formTitulo.className = 'text-sm font-black text-mostaza-caliente uppercase tracking-widest';
        btnCancelar.classList.remove('hidden');

        inputId.value = producto.id;
        inputNombre.value = producto.nombre;
        inputDescripcion.value = producto.descripcion || '';
        inputPrecio.value = producto.precio;
        inputStock.value = producto.stock;
    };

    // Método expuesto para limpiar el formulario y volver al modo Agregar
    container.resetearFormulario = () => {
        formTitulo.textContent = 'Agregar Nuevo Producto';
        formTitulo.className = 'text-sm font-black text-rojo-fuego uppercase tracking-widest';
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