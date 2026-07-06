export function SeccionAnalitica({ titulo, descripcion }) {
    const section = document.createElement('section');
    section.className = 'space-y-3';
    section.innerHTML = `
        <div class="border-l-2 border-slate-800 pl-3">
            <h2 class="text-sm font-bold text-slate-200 tracking-wide uppercase">${titulo}</h2>
            <p class="text-xs text-slate-500 mt-0.5">${descripcion}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 id-grid-cards"></div>
    `;
    return section;
}