export function FilaHistorial({ pedido }) {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-900/30 transition-colors duration-150 group';

    const fecha = new Date(pedido.fecha).toLocaleDateString('es-CO', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const estadoBadge = pedido.estado === 'Entregado' 
        ? `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Entregado</span>`
        : `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-red-950/40 border border-red-900/60 text-red-400">Cancelado</span>`;

    const itemsList = pedido.items.map(item => 
        `<span class="block text-xs text-slate-300">${item.cantidad}x ${item.nombre}</span>`
    ).join('');

    tr.innerHTML = `
        <td class="p-4 font-mono text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
            #${pedido.id}
            <span class="block text-[10px] text-slate-500 mt-0.5">${fecha}</span>
        </td>
        <td class="p-4 font-semibold text-white">
            ${pedido.cliente_nombre}
            <span class="block text-xs font-normal text-slate-400 mt-0.5">${pedido.telefono}</span>
        </td>
        <td class="p-4 text-xs text-slate-300">
            <span class="font-bold text-slate-400">T:</span> ${pedido.torre_bloque} 
            <span class="font-bold text-slate-400 ml-1">Apt:</span> ${pedido.apartamento}
        </td>
        <td class="p-4 space-y-0.5 max-w-xs truncate">
            ${itemsList}
        </td>
        <td class="p-4 text-right font-mono font-bold text-slate-200">
            $${pedido.total.toLocaleString()}
        </td>
        <td class="p-4 text-center text-xs">
            <span class="text-slate-400 block">${pedido.tipo_pago}</span>
            ${pedido.tipo_pago === 'Efectivo' ? `<span class="text-[10px] text-slate-500">Cambio: $${pedido.cambio.toLocaleString()}</span>` : ''}
        </td>
        <td class="p-4 text-center">
            ${estadoBadge}
        </td>
    `;
    return tr;
}