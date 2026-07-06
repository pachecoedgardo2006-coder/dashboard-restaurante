export function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none";
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `
        pointer-events-auto min-w-[280px] max-w-sm px-4 py-3 rounded-xl shadow-2xl 
        border backdrop-blur-md flex items-center justify-between gap-3
        transform translate-y-4 opacity-0 transition-all duration-300 ease-out
    `;

    // Estilos alineados con la identidad gráfica rústica y oscura de House Grill 6
    if (type === 'success') {
        toast.classList.add('bg-slate-950/90', 'border-red-500/30', 'text-amber-400');
    } else if (type === 'error') {
        toast.classList.add('bg-slate-950/90', 'border-red-600/40', 'text-red-500');
    } else {
        toast.classList.add('bg-slate-950/90', 'border-slate-800', 'text-slate-300');
    }

    toast.innerHTML = `
        <div class="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
            <span>${type === 'success' ? '🔥' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <p>${message}</p>
        </div>
        <button class="text-slate-500 hover:text-white text-xs font-bold focus:outline-none cursor-pointer">✕</button>
    `;

    toast.querySelector('button').addEventListener('click', () => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}