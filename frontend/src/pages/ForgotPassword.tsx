import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔥 Aquí luego irá llamada al backend
    const isAuthenticated = true;

    if (isAuthenticated) {
      navigate("/home");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Restaurar contraseña</h1>
          <p>No pierdas tu contraseña.</p>
        </div>

        <form className="login-form" onSubmit={handleForgotPassword}>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" placeholder="tuemail@ejemplo.com" />
          </div>
          <button type="submit" className="login-button">Restaurar contraseña</button>
        </form>

        <p className="login-footer">¿Recuerdas tu contraseña? <span className="login-links"><Link to="/login">Inicia sesión</Link></span></p>
      </div>
    </div>
  );
}

export default ForgotPassword;