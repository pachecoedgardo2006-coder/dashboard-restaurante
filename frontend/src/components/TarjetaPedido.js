// frontend/src/components/TarjetaPedido.js
export function TarjetaPedido({ pedido, onCambiarEstado }) {
    const card = document.createElement('div');
    
    // Flex-col y h-full garantizan que las tarjetas mantengan el mismo tamaño si están en un grid
    card.className = `p-4 rounded-xl border flex flex-col justify-between h-full transition-all shadow-md hover:shadow-lg ${
        pedido.estado === 'Pendiente' 
            ? 'bg-amber-950/15 border-amber-500/30 shadow-amber-950/5' 
            : 'bg-blue-950/15 border-blue-500/30 shadow-blue-950/5'
    }`;

    card.innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between items-center gap-2">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-950 text-slate-400 border border-slate-800">
                    #ID ${pedido.id}
                </span>
                <span class="text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide uppercase ${
                    pedido.estado === 'Pendiente' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
                }">
                    ${pedido.estado}
                </span>
            </div>
            <div class="min-w-0">
                <h3 class="font-bold text-sm text-white truncate">${pedido.cliente_nombre}</h3>
                <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>📍</span> <span class="truncate">T: ${pedido.torre_bloque} - Apt: ${pedido.apartamento}</span>
                </p>
                <p class="text-xs text-slate-400 flex items-center gap-1">
                    <span>📞</span> <span>${pedido.telefono}</span>
                </p>
            </div>
            
            <div class="pt-2 border-t border-slate-800/60 text-xs space-y-1">
                <p class="flex justify-between"><span class="text-slate-500">Método:</span> <span class="text-slate-300">${pedido.tipo_pago}</span></p>
                ${pedido.tipo_pago === 'Efectivo' ? `<p class="flex justify-between"><span class="text-slate-500">Cambio:</span> <span class="text-amber-400 font-semibold">$${pedido.cambio}</span></p>` : ''}
                ${pedido.observaciones ? `<p class="italic text-slate-500 bg-slate-950/40 p-1.5 rounded mt-1 border border-slate-900/50 break-all">"${pedido.observaciones}"</p>` : ''}
            </div>
        </div>
        
        <div class="mt-4 pt-2 border-t border-slate-800/60 flex gap-2">
            ${pedido.estado === 'Pendiente' ? `
                <button class="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 rounded-lg transition-colors cursor-pointer" data-action="preparar">
                    Preparar
                </button>
            ` : `
                <button class="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-2 rounded-lg transition-colors cursor-pointer" data-action="entregar">
                    Entregar
                </button>
            `}
            <button class="bg-slate-950 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 font-medium text-xs py-2 px-3 rounded-lg transition-all cursor-pointer" data-action="cancelar">
                Cancelar
            </button>
        </div>
    `;

    // Listeners
    card.querySelector('[data-action="cancelar"]').addEventListener('click', () => onCambiarEstado(pedido.id, 'Cancelado'));
    const btnPrincipal = card.querySelector('[data-action="preparar"]') || card.querySelector('[data-action="entregar"]');
    if (btnPrincipal) {
        btnPrincipal.addEventListener('click', () => {
            const nuevoEstado = pedido.estado === 'Pendiente' ? 'En preparación' : 'Entregado';
            onCambiarEstado(pedido.id, nuevoEstado);
        });
    }

    return card;
}