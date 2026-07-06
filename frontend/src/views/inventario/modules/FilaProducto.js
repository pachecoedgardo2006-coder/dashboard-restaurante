export function FilaProducto({ producto, onEditar }) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/60 transition-colors';
    
    const esStockBajo = producto.stock <= 5;

    tr.innerHTML = `
        <td class="py-3 px-4 font-mono text-xs text-slate-500">#${producto.id}</td>
        <td class="py-3 px-4 font-bold text-white">${producto.nombre}</td>
        <td class="py-3 px-4 text-xs text-slate-400 max-w-xs truncate">${producto.descripcion || '-'}</td>
        <td class="py-3 px-4 font-semibold text-slate-300">$${producto.precio.toFixed(2)}</td>
        <td class="py-3 px-4">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                esStockBajo ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-emerald-400'
            }">
                ${producto.stock} u. ${esStockBajo ? '(¡Bajo!)' : ''}
            </span>
        </td>
        <td class="py-3 px-4 text-right">
            <button class="bg-slate-800 hover:bg-cyan-900/40 text-cyan-400 border border-slate-700 hover:border-cyan-800/50 text-xs font-semibold py-1 px-3 rounded-md transition btn-edit">
                Modificar
            </button>
        </td>
    `;

    tr.querySelector('.btn-edit').addEventListener('click', () => onEditar(producto));
    return tr;
}