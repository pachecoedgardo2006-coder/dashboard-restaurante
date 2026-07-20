import { t, getIdioma, setIdioma, onCambioIdioma } from './i18n/i18n.js';

/**
 * Aplica las traducciones a todo elemento estático marcado con data-i18n
 * (título de la pestaña, sidebar, footer, etc). Las vistas dinámicas
 * se traducen a sí mismas al ejecutarse (usan t() directamente).
 */
function traducirEstaticos() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const clave = el.getAttribute('data-i18n');
        if (el.tagName === 'TITLE') {
            el.textContent = t(clave);
        } else {
            el.textContent = t(clave);
        }
    });
}

/**
 * Sincroniza el estado visual de los botones ES / EN según el idioma activo
 */
function actualizarBotonesIdioma() {
    const idiomaActivo = getIdioma();
    document.querySelectorAll('#lang-switcher .lang-btn').forEach((btn) => {
        const esActivo = btn.getAttribute('data-lang') === idiomaActivo;
        btn.classList.toggle('bg-red-600', esActivo);
        btn.classList.toggle('text-white', esActivo);
        btn.classList.toggle('text-slate-500', !esActivo);
        btn.classList.toggle('hover:text-slate-300', !esActivo);
    });
}

// Diccionario que mapea la ruta (hash) con su respectiva función generadora del DOM
// Convertido a funciones que ejecutan importaciones dinámicas (Lazy Loading)
const routes = {
    '#estadisticas': () => import('./views/estadisticas/index.js').then(m => m.renderEstadisticas),
    '#pedidos': () => import('./views/pedidos/index.js').then(m => m.renderPedidos),
    '#inventario': () => import('./views/inventario/index.js').then(m => m.renderInventario),
    '#historial': () => import('./views/historial/index.js').then(m => m.renderHistorial)
};

/**
 * Orquestador de navegación asíncrona SPA con soporte de URL (Hash)
 */
async function router() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    // 1. Capturar el hash actual de la URL. Si está vacío, por defecto va a estadísticas.
    const currentHash = window.location.hash || '#estadisticas';
    
    // 2. Obtener la vista correspondiente o usar estadísticas como fallback seguro
    const getViewLoader = routes[currentHash] || routes['#estadisticas'];

    try {
        // Renderizamos un esqueleto de carga temporal rápido y limpio en el DOM principal
        appContainer.innerHTML = `
            <div class="flex items-center justify-center min-h-[50vh] bg-slate-50 text-red-600 text-xs font-black tracking-widest animate-pulse uppercase">
                ${t('general.cargandoVista')}
            </div>
        `;

        // 3. Ejecutar de forma asíncrona la inicialización de la vista (Axios Fetches internos)
        const renderView = await getViewLoader();
        const viewNode = await renderView();

        // 4. Limpieza absoluta e inyección segura del nuevo nodo estructurado
        appContainer.innerHTML = '';
        appContainer.appendChild(viewNode);

        // 5. Sincronizar el estado de los estilos activos de Tailwind en el Sidebar
        actualizarSidebar(currentHash);

    } catch (error) {
        console.error(`Error crítico cargando la vista [${currentHash}]:`, error);
        appContainer.innerHTML = `
            <div class="p-6 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center font-bold text-xs uppercase tracking-wider max-w-xl mx-auto mt-12">
                ${t('general.errorVista')}
            </div>
        `;
    }
}

/**
 * Actualiza dinámicamente las clases del Sidebar según la vista activa
 * @param {string} activeHash - Hash actual de la aplicación
 */
function actualizarSidebar(activeHash) {
    // Convertimos el hash (#pedidos) al formato guardado en data-view (pedidos) para hacer match
    const viewName = activeHash.replace('#', '');
    
    document.querySelectorAll('#sidebar-nav .nav-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === viewName) {
            // Sincronización cambiada al color Rojo Fuego de control para la pestaña activa
            btn.classList.add('bg-slate-900', 'text-white', 'font-bold', 'border-l-4', 'border-red-600');
            btn.classList.remove('text-slate-400', 'hover:bg-slate-900/60');
        } else {
            btn.classList.remove('bg-slate-900', 'text-white', 'font-bold', 'border-l-4', 'border-red-600');
            btn.classList.add('text-slate-400', 'hover:bg-slate-900/60');
        }
    });
}

// Inicialización de Eventos y Listeners del Navegador
document.addEventListener('DOMContentLoaded', () => {
    const sidebarNav = document.getElementById('sidebar-nav');
    const langSwitcher = document.getElementById('lang-switcher');

    if (sidebarNav) {
        // Delegación de eventos de clic optimizada sobre el menú de navegación lateral
        sidebarNav.addEventListener('click', (e) => {
            const button = e.target.closest('.nav-btn');
            if (!button) return;

            const targetView = button.getAttribute('data-view');
            
            // En vez de inyectar directamente, mutamos la URL. El evento hashchange hará el resto.
            window.location.hash = `#${targetView}`;
        });
    }

    if (langSwitcher) {
        langSwitcher.addEventListener('click', (e) => {
            const btn = e.target.closest('.lang-btn');
            if (!btn) return;
            setIdioma(btn.getAttribute('data-lang'));
        });
    }

    // Cuando el idioma cambia, se retraducen los elementos estáticos, se sincronizan
    // los botones ES/EN y se vuelve a renderizar la vista activa con los nuevos textos.
    onCambioIdioma(() => {
        traducirEstaticos();
        actualizarBotonesIdioma();
        router();
    });

    document.documentElement.setAttribute('lang', getIdioma());
    traducirEstaticos();
    actualizarBotonesIdioma();

    // Escuchar cambios de ruta cuando el usuario navega o presiona botones de retroceso
    window.addEventListener('hashchange', router);

    // Carga inicial al abrir el Dashboard por primera vez
    router();
});