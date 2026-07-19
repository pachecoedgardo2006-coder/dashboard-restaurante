
export function FilaProducto({ producto, onEditar }) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';
 
    // Umbrales visuales de stock (no alteran la lógica de negocio, solo la lectura visual)
    let badge;
    if (producto.stock <= 5) {
        badge = { label: `${producto.stock} U. (Bajo)`, classes: 'bg-red-50 text-red-600' };
    } else if (producto.stock <= 20) {
        badge = { label: `${producto.stock} U. (Alerta)`, classes: 'bg-amber-50 text-amber-600' };
    } else {
        badge = { label: `${producto.stock} U. (Óptimo)`, classes: 'bg-emerald-50 text-emerald-600' };
    }
 
    tr.innerHTML = `
        <td class="py-4 px-4 text-xs text-slate-400 font-semibold">#${producto.id}</td>
        <td class="py-4 px-4 font-bold text-slate-900 uppercase text-xs tracking-wide">${producto.nombre}</td>
        <td class="py-4 px-4 text-xs text-slate-500 max-w-xs truncate">${producto.descripcion || '-'}</td>
        <td class="py-4 px-4 font-semibold text-slate-700">$${producto.precio.toFixed(2)}</td>
        <td class="py-4 px-4">
            <span class="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${badge.classes}">
                ${badge.label}
            </span>
        </td>
        <td class="py-4 px-4 text-right">
            <button class="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold py-1.5 px-4 rounded-full transition uppercase tracking-wide btn-edit cursor-pointer">
                Modificar
            </button>
        </td>
    `;
 
    tr.querySelector('.btn-edit').addEventListener('click', () => onEditar(producto));
    return tr;
}