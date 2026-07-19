export function CardMetrica({ titulo, valor, icono, color, bgIcono }) {
    const card = document.createElement('div');
    card.className = 'bg-linear-to-br from-slate-950 to-slate-900 border border-slate-900/80 hover:border-red-900/30 rounded-2xl p-6 shadow-md transition-all flex items-center gap-4 min-w-0';
    card.innerHTML = `
        <span class="h-12 w-12 shrink-0 rounded-full ${bgIcono} border flex items-center justify-center text-xl">${icono}</span>
        <div class="min-w-0 flex-1">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">${titulo}</p>
            <h3 class="text-2xl font-black ${color} mt-1 tracking-tight truncate">${valor}</h3>
        </div>
    `;
    return card;
}