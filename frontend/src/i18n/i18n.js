import es from '../locales/es.json';
import en from '../locales/en.json';

const DICCIONARIOS = { es, en };
const IDIOMA_POR_DEFECTO = 'es';
const CLAVE_STORAGE = 'hg6_idioma';

let idiomaActual = localStorage.getItem(CLAVE_STORAGE) || IDIOMA_POR_DEFECTO;
if (!DICCIONARIOS[idiomaActual]) idiomaActual = IDIOMA_POR_DEFECTO;

const suscriptores = new Set();

/**
 * Obtiene un valor anidado de un objeto a partir de una ruta tipo "pedidos.form.guardar"
 */
function obtenerValorAnidado(objeto, ruta) {
    return ruta.split('.').reduce((acc, llave) => (acc && acc[llave] !== undefined ? acc[llave] : undefined), objeto);
}

/**
 * Reemplaza placeholders {{variable}} dentro de un string de traducción
 */
function interpolar(texto, variables) {
    if (!variables) return texto;
    return texto.replace(/\{\{\s*(\w+)\s*\}\}/g, (coincidencia, nombre) => {
        return variables[nombre] !== undefined ? variables[nombre] : coincidencia;
    });
}

/**
 * Traduce una clave (ej: "pedidos.form.guardar") al idioma actual.
 * Si falta la clave, hace fallback a español y luego devuelve la clave misma.
 */
export function t(clave, variables) {
    const valor = obtenerValorAnidado(DICCIONARIOS[idiomaActual], clave);
    if (valor === undefined) {
        const fallback = obtenerValorAnidado(DICCIONARIOS[IDIOMA_POR_DEFECTO], clave);
        if (fallback === undefined) {
            console.warn(`[i18n] Clave de traducción no encontrada: "${clave}"`);
            return clave;
        }
        return interpolar(fallback, variables);
    }
    return interpolar(valor, variables);
}

export function getIdioma() {
    return idiomaActual;
}

export function setIdioma(nuevoIdioma) {
    if (!DICCIONARIOS[nuevoIdioma] || nuevoIdioma === idiomaActual) return;
    idiomaActual = nuevoIdioma;
    localStorage.setItem(CLAVE_STORAGE, nuevoIdioma);
    document.documentElement.setAttribute('lang', nuevoIdioma);
    suscriptores.forEach((callback) => callback(idiomaActual));
}

/**
 * Permite que otros módulos (ej: main.js) se enteren cuando el usuario cambia el idioma,
 * para poder re-renderizar la vista activa.
 */
export function onCambioIdioma(callback) {
    suscriptores.add(callback);
    return () => suscriptores.delete(callback);
}
