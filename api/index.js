const express = require("express");
const cors = require("cors");
const db = require("./db"); // ✅ conexión

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente ✅");
});

// ✅ Obtener todos los productos (Traerá la descripción automáticamente por el *)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).send("Error al obtener productos");
    } else {
      res.json(result);
    }
  });
});

// ✅ Obtener un solo producto (DETALLE)
app.get("/productos/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM productos WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error al obtener el producto");
    }

    if (result.length === 0) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }
    res.json(result[0]); 
  });
});

// ✅ Agregar Productos (ACTUALIZADO CON DESCRIPCIÓN)
app.post("/productos", (req, res) => {
  // Agregamos 'descripcion' al destructuring del body
  const { nombre, precio, imagen, categoria, descripcion } = req.body;
  
  const sql = "INSERT INTO productos (nombre, precio, imagen, categoria, descripcion) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [nombre, precio, imagen, categoria, descripcion], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al agregar el producto");
    } else {
      res.json({ mensaje: "Producto agregado correctamente", id: result.insertId });
    }
  });
});

// Ruta para eliminar productos
app.delete("/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ mensaje: "Producto eliminado" });
  });
});

// ✅ Ruta para ACTUALIZAR un producto (EDITAR)
app.put("/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio, imagen, categoria, descripcion } = req.body;
  
  const sql = `
    UPDATE productos 
    SET nombre = ?, precio = ?, imagen = ?, categoria = ?, descripcion = ? 
    WHERE id = ?
  `;

  db.query(sql, [nombre, precio, imagen, categoria, descripcion, id], (err, result) => {
    if (err) {
      console.log("Error al actualizar:", err);
      res.status(500).send("Error al actualizar el producto");
    } else {
      res.json({ mensaje: "Producto actualizado correctamente" });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});

module.exports = app;