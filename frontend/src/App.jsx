import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import DetalleProducto from "./pages/DetalleProducto";
import Login from "./pages/Login";
import Carrito from "./pages/Carrito";
import Admin from "./pages/Admin";
import "./style/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true); 
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const location = useLocation();

  useEffect(() => {
    setCargando(true); 
    // Corregido a /api/productos
    axios.get("/api/productos")
      .then(res => {
        setProductos(res.data);
        setCargando(false); 
      })
      .catch(err => {
        console.error("Error al traer productos:", err);
        setCargando(false);
      });
  }, [location]); 

  const productosFiltrados = productos.filter(producto => {
    const coincideCategoria = categoriaActiva === "Todas" || producto.categoria === categoriaActiva;
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        {cargando ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Cargando catálogo...</p>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={
              <div className="catalogo-container">
                <h1 className="catalogo-title">Mini Mundo</h1>
                <div className="filtros-container">
                  <div className="botones-categorias">
                    <button onClick={() => setCategoriaActiva("Todas")} style={{ backgroundColor: categoriaActiva === "Todas" ? "#ffaaf857" : "white" }}>Todo</button>
                    <button onClick={() => setCategoriaActiva("Reposteria")} style={{ backgroundColor: categoriaActiva === "Reposteria" ? "#ffaaf857" : "white" }}>Reposteria</button>
                    <button onClick={() => setCategoriaActiva("Souvenirs")} style={{ backgroundColor: categoriaActiva === "Souvenirs" ? "#ffaaf857" : "white" }}>Souvenirs</button>
                    <button onClick={() => setCategoriaActiva("Cotillon")} style={{ backgroundColor: categoriaActiva === "Cotillon" ? "#ffaaf857" : "white" }}>Cotillón</button>
                  </div>
                  <input type="text" placeholder="Buscar producto..." className="buscador-input" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
                </div>
                <div className="productos-grid">
                  {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(producto => (
                      <Link key={producto.id} to={`/producto/${producto.id}`} className="card">
                        <img src={producto.imagen} alt={producto.nombre} />
                        <div className="card-body">
                          <h3>{producto.nombre}</h3>
                          <div className="precio">${producto.precio}</div>
                          <div className="categoria">{producto.categoria}</div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p style={{ gridColumn: "1/-1", textAlign: "center", marginTop: "20px" }}>No se encontraron productos.</p>
                  )}
                </div>
              </div>
            } />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        )}
      </main>
      <Footer /> 
    </div>
  );
}
export default App;