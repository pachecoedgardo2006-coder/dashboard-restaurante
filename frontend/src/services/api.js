// frontend/src/services/api.js
import axios from 'axios';

// Configuración de la instancia centralizada de Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajusta el puerto
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Manejo global de errores (opcional pero muy útil para desarrollo)
api.interceptors.response.use(
    (response) => response.data, // Retorna directamente la data para limpiar los componentes
    (error) => {
        console.error('Error en la petición API:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export default api;