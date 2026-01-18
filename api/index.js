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

// ✅ Ruta para obtener productos
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

// ✅ Ruta para obtener UN solo producto por ID (DETALLE)
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
3
    res.json(result[0]); // ✅ devuelve un solo producto
  });
});

// Agregar Productos
app.post("/productos", (req, res) => {
  const {nombre, precio, imagen, categoria} = req.body;
  const sql = "INSERT INTO productos (nombre, precio, imagen, categoria) VALUES (?, ?, ?, ?)";

  db.query(sql, [nombre, precio, imagen, categoria], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error al agregar el producto");
    }else {
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});


module.exports = app;