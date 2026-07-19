export function SeccionAnalitica({ titulo, descripcion }) {
    const section = document.createElement('section');
    section.className = 'space-y-4';
    section.innerHTML = `
        <div class="flex items-baseline gap-3 pb-3 border-b border-slate-900">
            <h2 class="text-sm font-black text-white tracking-wider uppercase">${titulo}</h2>
            <span class="flex-1 h-px bg-linear-to-r from-red-600/50 to-transparent"></span>
        </div>
        <p class="text-xs text-slate-500 -mt-2">${descripcion}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 id-grid-cards"></div>
    `;
    return section;
}
