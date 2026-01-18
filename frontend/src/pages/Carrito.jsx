import { useContext } from "react";
import { CartContext } from "../components/CartContext";
import { useNavigate } from "react-router-dom";
import "../style/Carrito.css";

function Carrito() {
  const { carrito, setCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  const eliminarProducto = (indexEliminar) => {
    const nuevoCarrito = carrito.filter((_, index) => index !== indexEliminar);
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((acc, producto) => acc + Number(producto.precio), 0);

  const finalizarPedido = () => {
    if (carrito.length === 0) return;
    const telefono = "3482225622";
    let mensaje = "¡Hola! Quisiera realizar el siguiente pedido:\n\n";
    carrito.forEach((p, index) => {
      mensaje += `${index + 1}. *${p.nombre}* - $${p.precio}\n`;
    });
    mensaje += `\n *Total: $${total}*`;
    mensaje += "\n\n¿Me confirman si tienen stock?";
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="catalogo-container">
      <h1 className="catalogo-title">Tu Carrito 🛒</h1>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>Tu carrito está pidiendo globos...</p>
          <button onClick={() => navigate("/")} className="btn-volver-vacio">
            Explorar Productos
          </button>
        </div>
      ) : (
        <div className="carrito-layout">
          <div className="carrito-lista">
            {carrito.map((item, index) => (
              <div key={index} className="carrito-item">
                <img src={item.imagen} alt={item.nombre} className="carrito-item-img" />
                <div className="carrito-item-info">
                  <h3>{item.nombre}</h3>
                  <span className="categoria-tag">{item.categoria}</span>
                </div>
                <div className="carrito-item-precio">
                  <span>${item.precio}</span>
                  <button className="btn-eliminar" onClick={() => eliminarProducto(index)}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="carrito-resumen">
            <h2>Resumen</h2>
            <div className="resumen-fila">
              <span>Items:</span>
              <span>{carrito.length}</span>
            </div>
            <div className="resumen-fila total">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <button className="btn-comprar-wa" onClick={finalizarPedido}>
              Finalizar por WhatsApp 📱
            </button>
            <button className="btn-seguir" onClick={() => navigate("/")}>
              Seguir comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrito;