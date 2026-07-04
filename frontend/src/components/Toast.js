export function showToast(message, type = 'success') {
    // Buscar o crear el contenedor global de notificaciones
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        // Posicionado de manera elegante abajo a la derecha de la pantalla
        container.className = "fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-none";
        document.body.appendChild(container);
    }

    // Crear la mini pestaña emergente
    const toast = document.createElement('div');
    toast.className = `
        pointer-events-auto min-w-[280px] max-w-sm px-4 py-3 rounded-xl shadow-2xl 
        border backdrop-blur-md flex items-center justify-between gap-3
        transform translate-y-4 opacity-0 transition-all duration-300 ease-out
    `;

    // Estilos dinámicos según el tipo de respuesta del servidor
    if (type === 'success') {
        toast.classList.add('bg-slate-950/80', 'border-emerald-500/30', 'text-emerald-400');
    } else if (type === 'error') {
        toast.classList.add('bg-slate-950/80', 'border-rose-500/30', 'text-rose-400');
    } else {
        toast.classList.add('bg-slate-950/80', 'border-cyan-500/30', 'text-cyan-400');
    }

    // Contenido del Toast
    toast.innerHTML = `
        <div class="flex items-center gap-2 font-medium text-sm">
            <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <p>${message}</p>
        </div>
        <button class="text-slate-400 hover:text-white text-xs font-bold focus:outline-none cursor-pointer">✕</button>
    `;

    // Evento para cerrar manualmente con la '✕'
    toast.querySelector('button').addEventListener('click', () => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    // Animación de entrada (Trigger reflow)
    setTimeout(() => {
        toast.classList.remove('opacity-0', 'translate-y-4');
    }, 10);

    // Auto-eliminar después de 4 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}