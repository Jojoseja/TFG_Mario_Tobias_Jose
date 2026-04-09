import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
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
          <h1>Time to Focus</h1>
          <p>Organiza tu tiempo. Mejora tu enfoque.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo</label>
            <input id="email" type="email" placeholder="tuemail@ejemplo.com" />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" placeholder="••••••••" />
            <p className="login-links"><Link to="/forgot-password">¿Contraseña olvidada?</Link></p>
          </div>

          <button type="submit" className="login-button">Entrar</button>
        </form>

        <p className="login-footer">¿No tienes cuenta? <span className="login-links"><Link to="/register">Regístrate</Link></span></p>
      </div>
    </div>
  );
}

export default Login;