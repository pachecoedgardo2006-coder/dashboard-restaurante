export function Sidebar(onViewChange) {
    const aside = document.createElement('aside');
    aside.className = 'w-64 bg-slate-950 text-slate-200 flex flex-col justify-between border-r border-slate-900 shrink-0';

    aside.innerHTML = `
        <div>
            <!-- Header / Logo -->
            <div class="p-6 border-b border-slate-950 flex items-center gap-3">
                <div class="h-9 w-9 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-950/40 text-lg">
                    🍔
                </div>
                <div>
                    <h1 class="font-black text-base tracking-wide text-white leading-tight">ResiFoods</h1>
                    <p class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Panel de Control</p>
                </div>
            </div>

            <!-- Navegación -->
            <nav class="p-4 space-y-1.5" id="sidebar-nav">
                <button data-view="estadisticas" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer group">
                    <span class="text-lg opacity-70 group-hover:opacity-100 transition-opacity">📊</span> 
                    <span>Estadísticas</span>
                </button>
                <button data-view="pedidos" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer group">
                    <span class="text-lg opacity-70 group-hover:opacity-100 transition-opacity">📝</span> 
                    <span>Pedidos</span>
                </button>
                <button data-view="inventario" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 text-slate-400 hover:bg-slate-900 hover:text-white cursor-pointer group">
                    <span class="text-lg opacity-70 group-hover:opacity-100 transition-opacity">📦</span> 
                    <span>Inventario</span>
                </button>
            </nav>
        </div>

        <!-- Footer Sidebar -->
        <div class="p-4 border-t border-slate-900 text-[10px] font-mono text-slate-600 text-center uppercase tracking-widest bg-slate-950/50">
            Modo Interno • Residencia
        </div>
    </aside>
    `;

    // Manejador de eventos para SPA y estado activo visual
    const botones = aside.querySelectorAll('.nav-btn');
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            botones.forEach(b => b.classList.remove('bg-slate-900', 'text-white', 'border-l-2', 'border-amber-500', 'pl-3'));
            btn.classList.add('bg-slate-900', 'text-white', 'border-l-2', 'border-amber-500', 'pl-3');
            
            const view = btn.getAttribute('data-view');
            onViewChange(view);
        });
    });

    // Activar por defecto el primer botón (Estadísticas)
    setTimeout(() => botones[0].click(), 0);

    return aside;
}