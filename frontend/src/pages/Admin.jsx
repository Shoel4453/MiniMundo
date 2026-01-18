import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/App.css";

function Admin() {
    const navigate = useNavigate();
    const [subiendo, setSubiendo] = useState(false);
    const [productos, setProductos] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [formData, setFormData] = useState({
        nombre: "",
        precio: "",
        imagen: "",
        categoria: "Cotillon",
        descripcion: "" 
    });

    // Estilo común para los inputs para asegurar visibilidad
    const inputStyle = {
        padding: "12px",
        borderRadius: "10px",
        background: "#333",
        color: "white",
        border: "1px solid #555",
        fontSize: "16px"
    };

    useEffect(() => {
        const esAdmin = localStorage.getItem("admin");
        if (esAdmin !== "true") {
            navigate("/login");
        } else {
            cargarProductos();
        }
    }, [navigate]);

    const cargarProductos = () => {
        axios.get("http://localhost:3001/productos")
            .then(res => setProductos(res.data))
            .catch(err => console.error(err));
    };

    const cerrarSesion = () => {
        localStorage.removeItem("admin");
        navigate("/login");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const limpiarFormulario = () => {
        setFormData({ nombre: "", precio: "", imagen: "", categoria: "Cotillon", descripcion: "" });
        setEditandoId(null);
        cargarProductos();
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
        const url = editandoId
            ? `http://localhost:3001/productos/${editandoId}`
            : "http://localhost:3001/productos";

        const peticion = editandoId 
            ? axios.put(url, formData) 
            : axios.post(url, formData);

        peticion
            .then(() => {
                alert(editandoId ? "¡Producto actualizado! 🔄" : "¡Producto agregado! 🎈");
                limpiarFormulario();
            })
            .catch(err => {
                console.error("Error:", err);
                alert("Hubo un error");
            });
    };

    const prepararEdicion = (p) => {
        setEditandoId(p.id);
        setFormData({
            nombre: p.nombre,
            precio: p.precio,
            imagen: p.imagen,
            categoria: p.categoria,
            descripcion: p.descripcion || "" 
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarProducto = (id) => {
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
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
                <button onClick={cerrarSesion} style={{ backgroundColor: "#333", color: "white", fontSize: "12px", padding: "8px 15px", border: "1px solid #555" }}>
                    Cerrar Sesión 🔒
                </button>
            </div>

            <h1 className="catalogo-title" style={{ color: "var(--secondary-color)" }}>
                {editandoId ? "Editar Producto" : "Panel Admin"}
            </h1>

            <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto 50px", display: "flex", flexDirection: "column", gap: "15px" }}>
                <input 
                    name="nombre" 
                    placeholder="Nombre del producto" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    required 
                    style={inputStyle}
                />
                <input 
                    name="precio" 
                    type="number" 
                    placeholder="Precio" 
                    value={formData.precio} 
                    onChange={handleChange} 
                    required 
                    style={inputStyle}
                />
                
                <textarea 
                    name="descripcion" 
                    placeholder="Descripción del producto..." 
                    value={formData.descripcion} 
                    onChange={handleChange}
                    style={{ ...inputStyle, minHeight: "100px", fontFamily: "inherit" }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <input type="file" id="fileInput" onChange={handleFileChange} style={{ display: "none" }} accept="image/*" />
                    <button 
                        type="button" 
                        onClick={() => document.getElementById('fileInput').click()}
                        style={{ backgroundColor: "#444", border: "1px dashed #ff69b4", color: "white" }}
                        disabled={subiendo}
                    >
                        {subiendo ? "Subiendo..." : formData.imagen ? "✅ Imagen Lista" : "📁 Seleccionar Foto"}
                    </button>
                    {formData.imagen && <img src={formData.imagen} alt="Previa" style={{ width: "80px", borderRadius: "8px", margin: "0 auto" }} />}
                </div>

                <select name="categoria" value={formData.categoria} onChange={handleChange} style={inputStyle}>
                    <option value="Reposteria">Reposteria</option>
                    <option value="Souvenirs">Souvenirs</option>
                    <option value="Cotillon">Cotillón</option>
                </select>

                <button type="submit" style={{ backgroundColor: editandoId ? "#3498db" : "#ff69b4", color: "white", fontWeight: "bold" }}>
                    {editandoId ? "Actualizar Producto" : "Guardar Nuevo"}
                </button>
                
                {editandoId && (
                    <button type="button" style={{backgroundColor: "#777", color: "white"}} onClick={limpiarFormulario}>
                        Cancelar Edición
                    </button>
                )}
            </form>

            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Inventario</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {productos.map(p => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e1e24", padding: "15px", borderRadius: "10px", border: "1px solid #333" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                            <img src={p.imagen} alt="" style={{ width: "40px", height: "40px", borderRadius: "5px", objectFit: "cover" }} />
                            <div>
                                <strong style={{color: "white"}}>{p.nombre}</strong> <br />
                                <small style={{ color: "#2ecc71", fontWeight: "bold" }}>${p.precio}</small>
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button onClick={() => prepararEdicion(p)} style={{ backgroundColor: "#3498db", color: "white", padding: "5px 15px", fontSize: "12px", border: "none", borderRadius: "5px" }}>Editar</button>
                            <button onClick={() => eliminarProducto(p.id)} style={{ backgroundColor: "#ff4444", color: "white", padding: "5px 15px", fontSize: "12px", border: "none", borderRadius: "5px" }}>Borrar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Admin;