export function CardMetrica({ titulo, valor, icono, color, bgIcono }) {
    const card = document.createElement('div');
    card.className = 'bg-linear-to-br from-slate-950 to-slate-900 border border-slate-900/80 hover:border-red-900/30 rounded-2xl p-6 shadow-md transition-all flex items-center justify-between min-w-0';
    card.innerHTML = `
        <div class="min-w-0 flex-1 pr-3">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">${titulo}</p>
            <h3 class="text-2xl font-black ${color} mt-2 tracking-tight truncate">${valor}</h3>
        </div>
        <span class="text-2xl ${bgIcono} p-3 rounded-xl border shrink-0 transition-transform hover:scale-105">${icono}</span>
    `;
    return card;
}