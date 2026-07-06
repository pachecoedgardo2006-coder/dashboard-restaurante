export function CardMetrica({ titulo, valor, icono, colorClase, bgIconoClase }) {
    const card = document.createElement('div');
    card.className = 'bg-linear-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex items-center justify-between min-w-0';
    card.innerHTML = `
        <div class="min-w-0 flex-1 pr-3">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider truncate">${titulo}</p>
            <h3 class="text-2xl font-black ${colorClase} mt-2 truncate">${valor}</h3>
        </div>
        <span class="text-2xl ${bgIconoClase} p-3 rounded-xl border shrink-0">${icono}</span>
    `;
    return card;
}