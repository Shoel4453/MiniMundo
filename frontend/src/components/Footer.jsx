import { Link } from "react-router-dom";
import "../style/Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="copyright">
                    © 2026 Mini Mundo - Repostería y Cotillón
                    {/* El punto secreto es parte del texto pero es un Link invisible */}
                    <Link to="/login" className="secret-dot">.</Link>
                </p>
                
                <div className="footer-links">
                    <a href="https://www.instagram.com/minii_mund" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                    <a href="https://wa.me/5491122334455" target="_blank" rel="noopener noreferrer">
                        WhatsApp
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;