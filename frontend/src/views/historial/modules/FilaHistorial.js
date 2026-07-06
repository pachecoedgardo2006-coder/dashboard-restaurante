export function FilaHistorial({ pedido }) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/60 transition-colors duration-150 group border-b border-slate-900';

    const fecha = new Date(pedido.fecha).toLocaleDateString('es-CO', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const estadoBadge = pedido.estado === 'Entregado' 
        ? `<span class="px-3 py-1 text-[10px] font-black uppercase bg-emerald-950 border border-emerald-700 text-emerald-400 tracking-wider">Entregado</span>`
        : `<span class="px-3 py-1 text-[10px] font-black uppercase bg-red-950 border border-red-700 text-red-400 tracking-wider">Cancelado</span>`;

    const itemsList = pedido.items.map(item => 
        `<span class="block text-xs font-bold text-slate-300 uppercase tracking-wide">${item.cantidad}X ${item.nombre}</span>`
    ).join('');

    tr.innerHTML = `
        <td class="p-4 font-mono text-xs text-slate-500 group-hover:text-mostaza-caliente transition-colors">
            #${pedido.id}
            <span class="block text-[10px] text-slate-500 uppercase mt-0.5">${fecha}</span>
        </td>
        <td class="p-4 font-black text-white uppercase tracking-tight">
            ${pedido.cliente_nombre}
            <span class="block text-xs font-normal text-slate-400 font-mono tracking-normal mt-0.5">${pedido.telefono}</span>
        </td>
        <td class="p-4 text-xs text-slate-300 font-bold uppercase tracking-wide">
            <span class="text-slate-500">TORRE:</span> ${pedido.torre_bloque} 
            <span class="text-slate-500 ml-2">APT:</span> ${pedido.apartamento}
        </td>
        <td class="p-4 space-y-0.5 max-w-xs truncate">
            ${itemsList}
        </td>
        <td class="p-4 text-right font-mono font-black text-white text-base">
            $${pedido.total.toLocaleString()}
        </td>
        <td class="p-4 text-center text-xs uppercase font-bold tracking-wide">
            <span class="text-slate-300 block">${pedido.tipo_pago}</span>
            ${pedido.tipo_pago === 'Efectivo' ? `<span class="text-[10px] text-slate-500 font-mono tracking-normal block mt-0.5">VUELTO: $${pedido.cambio.toLocaleString()}</span>` : ''}
        </td>
        <td class="p-4 text-center">
            ${estadoBadge}
        </td>
    `;
    return tr;
}