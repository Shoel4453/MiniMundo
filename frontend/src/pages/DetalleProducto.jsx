import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../components/CartContext";
import "../style/DetalleProducto.css";

function DetalleProducto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { agregarAlCarrito } = useContext(CartContext);

  useEffect(() => {
    // Corregido a /api/productos?id=
    axios.get(`/api/productos?id=${id}`)
      .then(res => setProducto(res.data))
      .catch(err => console.log("Error:", err));
  }, [id]);

  if (!producto) return <div className="catalogo-container"><h2>Cargando...</h2></div>;

  return (
    <div className="catalogo-container">
      <div className="detalle-page-container">
        <div className="detalle-imagen-wrapper">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>
        <div className="detalle-info-wrapper">
          <span className="detalle-categoria">{producto.categoria}</span>
          <h1 className="detalle-nombre">{producto.nombre}</h1>
          <p className="detalle-precio">${producto.precio}</p>
          <div className="detalle-descripcion">
            <p>{producto.descripcion || "Producto de alta calidad ideal para festejos y decoración."}</p>
          </div>
          <div className="selector-cantidad-detalle">
            <button className="btn-qty" onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
            <span className="qty-value">{cantidad}</span>
            <button className="btn-qty" onClick={() => setCantidad(cantidad + 1)}>+</button>
          </div>
          <div className="detalle-acciones">
            <button className="btn-agregar-carrito" onClick={() => agregarAlCarrito(producto, cantidad)}>
              Añadir {cantidad} al Carrito
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