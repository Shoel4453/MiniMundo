import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "./CartContext"; 
import logo from "../assets/Logo3.png"; 
import "../style/Navbar.css";

function Navbar() {
  const { carrito } = useContext(CartContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Mini Mundo Logo" className="logo-img" />
        </Link>
        
        <div className="navbar-links">      
          <Link to="/carrito" className="nav-item cart-link">
            <span className="cart-icon">🛒</span>
            {carrito.length > 0 && (
              <span className="cart-badge">{carrito.length}</span>
            )}
          </Link>
          {/* El acceso admin ha sido movido al footer como punto secreto */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;