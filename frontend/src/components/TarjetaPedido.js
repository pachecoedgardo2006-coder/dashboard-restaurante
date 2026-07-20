import { t } from '../i18n/i18n.js';

export function TarjetaPedido({ pedido, onCambiarEstado }) {
    const card = document.createElement('div');
    
    // Flex-col y h-full garantizan que las tarjetas mantengan el mismo tamaño si están en un grid
    card.className = `p-4 rounded-xl border flex flex-col justify-between h-full transition-all shadow-md hover:shadow-lg ${
        pedido.estado === 'Pendiente' 
            ? 'bg-red-950/15 border-red-500/20 shadow-red-950/5' 
            : 'bg-slate-900/50 border-amber-500/20 shadow-slate-950/5'
    }`;

    card.innerHTML = `
        <div class="space-y-2">
            <div class="flex justify-between items-center gap-2">
                <span class="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-950 text-slate-400 border border-slate-900">
                    #ID ${pedido.id}
                </span>
                <span class="text-[10px] font-black px-2 py-0.5 rounded tracking-widest uppercase ${
                    pedido.estado === 'Pendiente' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }">
                    ${t(`estados.${pedido.estado}`)}
                </span>
            </div>
            <div class="min-w-0">
                <h3 class="font-black text-sm text-white truncate uppercase tracking-tight">${pedido.cliente_nombre}</h3>
                <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <span>📍</span> <span class="truncate">T: ${pedido.torre_bloque} - Apt: ${pedido.apartamento}</span>
                </p>
                <p class="text-xs text-slate-400 flex items-center gap-1">
                    <span>📞</span> <span>${pedido.telefono}</span>
                </p>
            </div>
            
            <div class="pt-2 border-t border-slate-900 text-xs space-y-1">
                <p class="flex justify-between"><span class="text-slate-500">${t('pedidos.card.metodo')}</span> <span class="text-slate-300 font-medium">${t(`pagos.${pedido.tipo_pago}`)}</span></p>
                ${pedido.tipo_pago === 'Efectivo' ? `<p class="flex justify-between"><span class="text-slate-500">${t('pedidos.card.cambio')}</span> <span class="text-amber-400 font-bold font-mono">$${pedido.cambio}</span></p>` : ''}
                ${pedido.observaciones ? `<p class="italic text-slate-400 bg-slate-950/60 p-1.5 rounded mt-1 border border-slate-900 break-all">"${pedido.observaciones}"</p>` : ''}
            </div>
        </div>
        
        <div class="mt-4 pt-2 border-t border-slate-900 flex gap-2">
            ${pedido.estado === 'Pendiente' ? `
                <button class="flex-1 bg-red-600 hover:bg-red-500 text-white font-black text-xs py-2 rounded-lg transition-colors cursor-pointer uppercase tracking-wider" data-action="preparar">
                    ${t('pedidos.card.preparar')}
                </button>
            ` : `
                <button class="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-2 rounded-lg transition-colors cursor-pointer uppercase tracking-wider" data-action="entregar">
                    ${t('pedidos.card.entregar')}
                </button>
            `}
            <button class="bg-slate-950 hover:bg-red-950/20 border border-slate-900 hover:border-red-500/30 text-slate-500 hover:text-red-400 font-bold text-xs py-2 px-3 rounded-lg transition-all cursor-pointer uppercase tracking-wider" data-action="cancelar">
                ${t('pedidos.card.cancelar')}
            </button>
        </div>
    `;

    // Listeners intactos
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