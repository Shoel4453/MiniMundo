import { useState, useEffect } from "react";
import axios from "axios";
import "../style/App.css";

function Admin() {
    const [subiendo, setSubiendo] = useState(false);
    const [productos, setProductos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        imagen: "",
        categoria: "Cotillon"
    });

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        axios.get("http://localhost:3001/productos")
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSubiendo(true);
        const data = new FormData();
        data.append("image", file);

        try {
            const API_KEY = "60e776a0e77ab2c7182a2d2ee6833161";
            const res = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, data);
            const urlDirecta = res.data.data.url;
            setFormData({ ...formData, imagen: urlDirecta });
            alert("¡Imagen cargada con éxito! ✅");
        } catch (err) {
            console.error("Error en ImgBB:", err);
            alert("Error al subir la imagen");
        } finally {
            setSubiendo(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const pass = prompt("Contraseña de administrador:");
        if (pass !== "1234") return alert("Acceso denegado");

        const url = editandoId
            ? `http://localhost:3001/productos/${editandoId}`
            : "http://localhost:3001/productos";

        const metodo = editandoId ? axios.put : axios.post;

        metodo(url, formData)
            .then(() => {
                alert(editandoId ? "¡Producto actualizado! 🔄" : "¡Producto agregado! 🎈");
                setFormData({ nombre: "", precio: "", imagen: "", categoria: "Cotillon" });
                setEditandoId(null);
                cargarProductos(); 
            })
            .catch(err => console.error(err));
    };

    const prepararEdicion = (p) => {
        setEditandoId(p.id);
        setFormData({
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen,
            categoria: p.categoria
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarProducto = (id) => {
        const pass = prompt("Contraseña para eliminar:");
        if (pass !== "1234") return alert("Acceso denegado");

        if (window.confirm("¿Seguro quieres eliminar este producto?")) {
            axios.delete(`http://localhost:3001/productos/${id}`)
                .then(() => {
                    alert("Eliminado correctamente");
                    cargarProductos();
                })
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="catalogo-container">
            <h1 className="catalogo-title">{editandoId ? "Editar Producto" : "Panel Admin"}</h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto 50px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
                <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} required />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
                    <button 
                        type="button" 
                        onClick={() => document.getElementById('fileInput').click()}
                        style={{ backgroundColor: "#444", border: "1px dashed var(--primary-color)" }}
                        disabled={subiendo}
                    >
                        {subiendo ? "Subiendo..." : formData.imagen ? "✅ Imagen Lista" : "📁 Seleccionar Foto desde PC"}
                    </button>
                    {formData.imagen && <img src={formData.imagen} alt="Previa" style={{ width: "80px", borderRadius: "8px", margin: "0 auto" }} />}
                </div>

                <select name="categoria" value={formData.categoria} onChange={handleChange} style={{ padding: "12px", borderRadius: "50px", background: "#1a1a1a", color: "white" }}>
                    <option value="Reposteria">Reposteria</option>
                    <option value="Souvenirs">Souvenirs</option>
                    <option value="Cotillon">Cotillón</option>
                </select>

                <button type="submit" style={{ backgroundColor: editandoId ? "#3498db" : "var(--primary-color)" }}>
                    {editandoId ? "Actualizar Producto" : "Guardar Nuevo"}
                </button>
                
                {editandoId && (
                    <button type="button" onClick={() => { 
                        setEditandoId(null); 
                        setFormData({ nombre: "", precio: "", imagen: "", categoria: "Cotillon" });
                    }}>
                        Cancelar Edición
                    </button>
                )}
            </form>

            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Gestión de Inventario</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {productos.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e1e24", padding: "15px", borderRadius: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <img src={p.imagen} alt="" style={{ width: "40px", height: "40px", borderRadius: "5px", objectFit: "cover" }} />
                            <div>
                                <strong>{p.nombre}</strong> <br />
                                <small style={{ color: "#2ecc71" }}>${p.precio}</small>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => prepararEdicion(p)} style={{ backgroundColor: "#3498db", padding: "5px 15px", fontSize: "12px" }}>Editar</button>
                            <button onClick={() => eliminarProducto(p.id)} style={{ backgroundColor: "#ff4444", padding: "5px 15px", fontSize: "12px" }}>Borrar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;