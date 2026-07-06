export function GraficoProgreso({ titulo, descripcion, items, deColor, aColor }) {
    const container = document.createElement('div');
    container.className = 'bg-slate-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4';
    container.innerHTML = `
        <div>
            <h2 class="text-base font-bold text-white">${titulo}</h2>
            <p class="text-xs text-slate-500">${descripcion}</p>
        </div>
        <div class="space-y-4 pt-2" id="items-container"></div>
    `;

    const itemsContainer = container.querySelector('#items-container');
    if (!items || items.length === 0) {
        itemsContainer.innerHTML = `<p class="text-xs text-slate-500 py-4 text-center">Sin datos críticos para reportar.</p>`;
        return container;
    }

    const maxVal = Math.max(...items.map(i => i.valor), 1);

    items.forEach(item => {
        const porcentaje = (item.valor / maxVal) * 100;
        const row = document.createElement('div');
        row.className = 'space-y-1';
        row.innerHTML = `
            <div class="flex justify-between text-xs gap-4">
                <span class="font-bold text-slate-200 truncate">${item.nombre}</span>
                <span class="text-slate-400 font-medium shrink-0">${item.etiquetaValor}</span>
            </div>
            <div class="w-full bg-slate-900 rounded-lg h-2.5 overflow-hidden">
                <div class="bg-linear-to-r ${deColor} ${aColor} h-2.5 rounded-lg transition-all duration-700" style="width: 0%"></div>
            </div>
        `;
        
        setTimeout(() => {
            const bar = row.querySelector('.bg-linear-to-r');
            if (bar) bar.style.width = `${porcentaje}%`;
        }, 50);

        itemsContainer.appendChild(row);
    });

    return container;
}