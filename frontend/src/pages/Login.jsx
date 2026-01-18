import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/App.css";

function Login() {
    const [pass, setPass] = useState("");
    const navigate = useNavigate();

    const acceder = (e) => {
        e.preventDefault();
        if (pass === "802250") {
            // Guardamos un "token" simple en el navegador para saber que entró
            localStorage.setItem("admin", "true");
            navigate("/admin");
        } else {
            alert("Contraseña incorrecta");
        }
    };

    return (
        <div className="catalogo-container" style={{ textAlign: "center", marginTop: "100px" }}>
            <h2 className="catalogo-title">Acceso Restringido</h2>
            <form onSubmit={acceder} style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "300px", margin: "0 auto" }}>
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={pass} 
                    onChange={(e) => setPass(e.target.value)}
                    style={{ width: "100%" }}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
}

export default Login;