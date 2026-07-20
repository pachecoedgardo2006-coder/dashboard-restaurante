import { t } from '../../../i18n/i18n.js';

export function FormInventario({ onGuardar, onCancelarEdicion }) {
    const container = document.createElement('div');
    container.className = 'bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-fit space-y-5';

    container.innerHTML = `
        <div>
            <h2 id="form-titulo" class="text-base font-black text-slate-900">${t('inventario.form.agregarTitulo')}</h2>
            <p class="text-[11px] text-slate-400 font-semibold mt-1">${t('inventario.form.agregarSubtitulo')}</p>
        </div>

        <form id="form-producto-inv" class="space-y-4" autocomplete="off">
            <input type="hidden" id="edit-id" value="">
            <div>
                <label class="block text-[11px] font-bold text-slate-500 mb-1.5">${t('inventario.form.nombreCompleto')}</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></span>
                    <input type="text" id="inv-nombre" required autocomplete="off"
                        class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400">
                </div>
            </div>
            <div>
                <label class="block text-[11px] font-bold text-slate-500 mb-1.5">${t('inventario.form.descripcionCorta')}</label>
                <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></span>
                    <input type="text" id="inv-descripcion" autocomplete="off"
                        class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400">
                </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 mb-1.5">${t('inventario.form.precio')}</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input type="number" id="inv-precio" min="0" step="any" required autocomplete="off"
                            class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-2 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400">
                    </div>
                </div>
                <div>
                    <label class="block text-[11px] font-bold text-slate-500 mb-1.5">${t('inventario.form.stockInicial')}</label>
                    <div class="relative">
                        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></span>
                        <input type="number" id="inv-stock" min="0" required autocomplete="off"
                            class="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-2 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400">
                    </div>
                </div>
            </div>
            <div class="flex gap-2 pt-2">
                <button type="submit" class="flex-1 bg-rojo-fuego hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-full text-xs uppercase tracking-wide transition cursor-pointer">
                    ${t('inventario.form.guardarCambios')}
                </button>
                <button type="button" id="btn-cancelar-edicion" class="hidden bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 px-4 rounded-full text-xs transition font-bold uppercase tracking-wide cursor-pointer">
                    ${t('general.cancelar')}
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
        formTitulo.textContent = t('inventario.form.modificarTitulo');
        formTitulo.className = 'text-base font-black text-amber-600';
        btnCancelar.classList.remove('hidden');

        inputId.value = producto.id;
        inputNombre.value = producto.nombre;
        inputDescripcion.value = producto.descripcion || '';
        inputPrecio.value = producto.precio;
        inputStock.value = producto.stock;
    };

    // Método expuesto para limpiar el formulario y volver al modo Agregar
    container.resetearFormulario = () => {
        formTitulo.textContent = t('inventario.form.agregarTitulo');
        formTitulo.className = 'text-base font-black text-slate-900';
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