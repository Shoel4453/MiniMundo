import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext"; 
import logo from "../assets/Logo3.png"; // Asegúrate de que la ruta sea correcta
import "../style/Navbar.css";

function Navbar() {
  const { carrito } = useContext(CartContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          {/* Colocamos el Logo PNG aquí */}
          <img src={logo} alt="Mini Mundo Logo" className="logo-img" />
        </Link>
        
        <div className="navbar-links">      
          <Link to="/carrito" className="nav-item cart-link">
            <span className="cart-icon">🛒</span>
            {carrito.length > 0 && (
              <span className="cart-badge">{carrito.length}</span>
            )}
          </Link>
          
          <Link to="/admin" className="nav-item admin-link">
            <span className="admin-icon">⚙️</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;