import { conectarDB } from '../config/db.js';

export const obtenerProductos = async (req, res) => {
    try {
        const db = await conectarDB();
        const productos = await db.all('SELECT * FROM productos ORDER BY nombre ASC');
        await db.close();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el inventario: ' + error.message });
    }
};

export const crearProducto = async (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    if (!nombre || precio === undefined || stock === undefined) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, precio, stock)' });
    }

    try {
        const db = await conectarDB();
        const resultado = await db.run(
            'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
            [nombre, descripcion, precio, stock]
        );
        await db.close();
        res.status(201).json({ id: resultado.lastID, nombre, descripcion, precio, stock });
    } catch (error) {
        res.status(500).json({ error: 'Error al añadir producto: ' + error.message });
    }
};

export const editarProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;

    try {
        const db = await conectarDB();
        const productoExiste = await db.get('SELECT id FROM productos WHERE id = ?', [id]);
        
        if (!productoExiste) {
            await db.close();
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await db.run(
            `UPDATE productos 
             SET nombre = COALESCE(?, nombre), 
                 descripcion = COALESCE(?, descripcion), 
                 precio = COALESCE(?, precio), 
                 stock = COALESCE(?, stock) 
             WHERE id = ?`,
            [nombre, descripcion, precio, stock, id]
        );

        const productoActualizado = await db.get('SELECT * FROM productos WHERE id = ?', [id]);
        await db.close();
        res.json(productoActualizado);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto: ' + error.message });
    }
};