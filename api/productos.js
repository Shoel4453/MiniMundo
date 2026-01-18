import pool from "./db.js";

export default async function handler(req, res) {
  // Capturamos el ID si viene en la URL (ej: /api/productos?id=5)
  const { id } = req.query;

  try {
    switch (req.method) {
      case 'GET':
        if (id) {
          // Lógica de "Obtener un solo producto" (DETALLE)
          const [result] = await pool.query("SELECT * FROM productos WHERE id = ?", [id]);
          if (result.length === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
          return res.status(200).json(result[0]);
        } else {
          // Lógica de "Obtener todos los productos"
          const [rows] = await pool.query("SELECT * FROM productos");
          return res.status(200).json(rows);
        }

      case 'POST':
        // Lógica de "Agregar Productos"
        const { nombre, precio, imagen, categoria, descripcion } = req.body;
        const [insResult] = await pool.query(
          "INSERT INTO productos (nombre, precio, imagen, categoria, descripcion) VALUES (?, ?, ?, ?, ?)",
          [nombre, precio, imagen, categoria, descripcion]
        );
        return res.status(201).json({ mensaje: "Producto agregado", id: insResult.insertId });

      case 'PUT':
        // Lógica de "Actualizar producto" (EDITAR)
        const { n_nombre, n_precio, n_imagen, n_categoria, n_descripcion } = req.body;
        await pool.query(
          "UPDATE productos SET nombre = ?, precio = ?, imagen = ?, categoria = ?, descripcion = ? WHERE id = ?",
          [n_nombre, n_precio, n_imagen, n_categoria, n_descripcion, id]
        );
        return res.status(200).json({ mensaje: "Producto actualizado correctamente" });

      case 'DELETE':
        // Lógica de "Eliminar producto"
        await pool.query("DELETE FROM productos WHERE id = ?", [id]);
        return res.status(200).json({ mensaje: "Producto eliminado" });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
} catch (error) {
    console.error("Error detectado:", error);
    return res.status(500).json({ 
      debug_error: error.message, 
      stack: error.code 
    });
  }
}