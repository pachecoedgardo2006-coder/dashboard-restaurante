export function SeccionAnalitica({ titulo, descripcion }) {
    const section = document.createElement('section');
    section.className = 'space-y-3';
    section.innerHTML = `
        <div class="border-l-2 border-red-600 pl-3">
            <h2 class="text-xs font-black text-slate-100 tracking-wider uppercase">${titulo}</h2>
            <p class="text-xs text-slate-500 mt-0.5">${descripcion}</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 id-grid-cards"></div>
    `;
    return section;
}