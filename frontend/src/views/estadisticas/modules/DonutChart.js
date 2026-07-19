export function DonutChart({ titulo, descripcion, items }) {
    const container = document.createElement('div');
    container.className = 'bg-slate-950/60 border border-slate-900 rounded-2xl p-6 shadow-xl';

    if (!items || items.length === 0) {
        container.innerHTML = `
            <div>
                <h2 class="text-base font-black tracking-tight text-white uppercase">${titulo}</h2>
                <p class="text-xs text-slate-500">${descripcion}</p>
            </div>
            <p class="text-xs text-slate-500 py-8 text-center">Sin datos suficientes para el mapeo de torres.</p>
        `;
        return container;
    }

    const paleta = ['#dc2626', '#f59e0b', '#facc15', '#64748b', '#7c3aed', '#0ea5e9'];
    const total = items.reduce((sum, it) => sum + it.valor, 0) || 1;

    let acumulado = 0;
    const segmentos = items.map((it, i) => {
        const pct = (it.valor / total) * 100;
        const inicio = acumulado;
        acumulado += pct;
        return `${paleta[i % paleta.length]} ${inicio}% ${acumulado}%`;
    }).join(', ');

    container.innerHTML = `
        <div class="mb-4">
            <h2 class="text-base font-black tracking-tight text-white uppercase">${titulo}</h2>
            <p class="text-xs text-slate-500">${descripcion}</p>
        </div>
        <div class="flex items-center gap-6 flex-wrap">
            <div class="relative h-36 w-36 shrink-0 rounded-full" style="background: conic-gradient(${segmentos})">
                <div class="absolute inset-3 bg-slate-950 rounded-full flex flex-col items-center justify-center">
                    <span class="text-xl font-black text-white">${total}</span>
                    <span class="text-[9px] text-slate-500 uppercase tracking-wider">Pedidos</span>
                </div>
            </div>
            <div class="flex-1 min-w-[140px] space-y-2" id="leyenda"></div>
        </div>
    `;

    const leyenda = container.querySelector('#leyenda');
    items.forEach((it, i) => {
        const pct = ((it.valor / total) * 100).toFixed(0);
        const fila = document.createElement('div');
        fila.className = 'flex items-center justify-between gap-2 text-xs';
        fila.innerHTML = `
            <span class="flex items-center gap-2 text-slate-300 truncate">
                <span class="h-2.5 w-2.5 rounded-full shrink-0" style="background:${paleta[i % paleta.length]}"></span>
                ${it.nombre}
            </span>
            <span class="font-mono text-slate-400 shrink-0">${pct}%</span>
        `;
        leyenda.appendChild(fila);
    });

    return container;
}