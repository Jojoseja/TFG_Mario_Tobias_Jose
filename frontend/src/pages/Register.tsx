import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
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
          <h1>Registro de usuario</h1>
          <p>Un paso más cerca de alcanzar tus objetivos.</p>
        </div>

        <form className="login-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" placeholder="tuemail@ejemplo.com" />
          </div>

          <div className="input-group">
            <label htmlFor="username">Usuario</label>
            <input id="username" type="text" placeholder="Tu nombre de usuario" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input id="confirmPassword" type="password" placeholder="••••••••" />
          </div>

          <button type="submit" className="login-button">Registrar</button>
        </form>

        <p className="login-footer">¿Ya tienes cuenta? <span className="login-links"><Link to="/login">Inicia sesión</Link></span></p>
      </div>
    </div>
  );
}

export default Register;