import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import DetalleProducto from "./pages/DetalleProducto";
import Carrito from "./pages/Carrito";
import Admin from "./pages/Admin";
import "./style/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado para el spinner
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const location = useLocation();

  // Carga de productos con corrección de sintaxis en Axios
  useEffect(() => {
    setCargando(true); 
    axios.get("http://localhost:3001/productos")
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
        {/* Si está cargando, muestra el Spinner. Si no, muestra las Rutas */}
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
                    <button className="Todas"
                      onClick={() => setCategoriaActiva("Todas")}
                      style={{ backgroundColor: categoriaActiva === "Todas" ? "#ffaaf857" : "#rgba(253, 179, 225, 0.43)" }}
                    >Todo</button>

                    <button
                      onClick={() => setCategoriaActiva("Reposteria")}
                      style={{ backgroundColor: categoriaActiva === "Reposteria" ? "#ffaaf857" : "#ffffffff" }}
                    >Reposteria</button>

                    <button 
                      onClick={() => setCategoriaActiva("Souvenirs")}
                      style={{ backgroundColor: categoriaActiva === "Souvenirs" ? "#ffaaf857" : "#ffffffff" }}
                    >Souvenirs</button>

                    <button 
                      onClick={() => setCategoriaActiva("Cotillon")}
                      style={{ backgroundColor: categoriaActiva === "Cotillon" ? "#ffaaf857" : "#ffffffff" }}
                    >Cotillón</button>
                  </div>

                  <input
                    type="text"
                    placeholder="Buscar producto..."
                    className="buscador-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
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
                    <p style={{ gridColumn: "1/-1", textAlign: "center", marginTop: "20px" }}>
                      No se encontraron productos.
                    </p>
                  )}
                </div>
              </div>
            } />

            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;