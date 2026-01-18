import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../components/CartContext";
import "../style/DetalleProducto.css";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const { agregarAlCarrito } = useContext(CartContext);

  useEffect(() => {
    axios.get(`http://localhost:3001/productos/${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.log("Error:", err));
  }, [id]);

  if (!producto) return <div className="catalogo-container"><h2>Cargando...</h2></div>;

  return (
    <div className="catalogo-container">
      {/* Esta es la clase principal que controla el tamaño del cuadro blanco */}
      <div className="detalle-page-container">
        
        <div className="detalle-imagen-wrapper">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-info-wrapper">
          <span className="detalle-categoria">{producto.categoria}</span>
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-precio">${producto.precio}</p>
          
          <div className="detalle-descripcion">
            <p>Prenda de diseño exclusivo fabricada con materiales premium. 
               Ideal para quienes buscan estilo y durabilidad en una sola pieza.</p>
          </div>

          <div className="detalle-acciones">
            <button className="btn-agregar-carrito" onClick={() => agregarAlCarrito(producto)}>
              Añadir al Carrito
            </button>
            <button className="btn-volver-atras" onClick={() => navigate("/")}>
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalleProducto;