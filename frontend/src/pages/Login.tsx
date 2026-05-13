import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";
import { loginRequest } from "../services/authService";
import { saveStoredUser } from "../services/userStorageService";
import { getLatestProject } from "../services/homeService";
import {
  removeStoredLatestProject,
  saveStoredLatestProject,
} from "../services/latestProjectStorageService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setNotification({
        type: "error",
        text: "Por favor, completa todos los campos.",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);

      return;
    }

    try {
      const user = await loginRequest({
        email,
        password,
      });

      saveStoredUser(user);

      try {
        if (user.id) {
          const latestProject = await getLatestProject(user.id);
          saveStoredLatestProject(latestProject);
        } else {
          removeStoredLatestProject();
        }
      } catch (error) {
        console.error("No se pudo cargar el último proyecto trabajado", error);
        removeStoredLatestProject();
      }

      setNotification({
        type: "success",
        text: "Inicio de sesión exitoso. Redirigiendo...",
      });

      setTimeout(() => {
        setNotification(null);
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error("Error al iniciar sesión", error);

      setNotification({
        type: "error",
        text: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  return (
    <>
      {notification && (
        <div className={`notification-banner ${notification.type}`}>
          {notification.text}
        </div>
      )}

      <div className="login-page">
        <div className="login-card">
          <div className="login-brand">
            <h1>Time to Focus</h1>
            <p>Organiza tu tiempo. Mejora tu enfoque.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="email">Correo</label>
              <input
                id="email"
                type="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <p className="login-links">
                <Link to="/forgot-password">¿Contraseña olvidada?</Link>
              </p>
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>

          <p className="login-footer">
            ¿No tienes cuenta?{" "}
            <span className="login-links">
              <Link to="/register">Regístrate</Link>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;