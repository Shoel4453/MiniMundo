const pool = require("./db");

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const [rows] = await pool.query("SELECT * FROM productos");
      return res.status(200).json(rows);
    }
    
    if (req.method === 'POST') {
      const { nombre, precio, imagen, categoria, descripcion } = req.body;
      const [result] = await pool.query(
        "INSERT INTO productos (nombre, precio, imagen, categoria, descripcion) VALUES (?, ?, ?, ?, ?)",
        [nombre, precio, imagen, categoria, descripcion]
      );
      return res.status(201).json({ id: result.insertId, ...req.body });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}