import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";
import { ApiConstants } from "../constants/ApiConstants";
import type { User } from "../types/User";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/home") // TODO: Eliminar cuando se vaya a entregar, solo está para cuando inicio el frontend
    if (!email || !password) {
      setNotification({
        type: "error",
        text: "Por favor, completa todos los campos."
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
    }

    try {
      const response = await fetch (ApiConstants.AUTH_PATH + ApiConstants.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        setNotification({
          type: "error",
          text: "Credenciales incorrectas. Por favor, inténtalo de nuevo."
        });
        setTimeout(() => {
          setNotification(null);
        }, 3000);
        return;
      }

      //Guardamos el usuario en localStorage para el inicio de sesión.
      const user: User = await response.json();

      setNotification({
        type: "success",
        text: "Inicio de sesión exitoso. Redirigiendo..."
      });
      setTimeout(() => {
        setNotification(null);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/home");
      }, 1500);

    } catch (error) {
      setNotification({
        type: "error",
        text: "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
      return;
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
              <p className="login-links"><Link to="/forgot-password">¿Contraseña olvidada?</Link></p>
            </div>

            <button type="submit" className="login-button">Entrar</button>
          </form>

          <p className="login-footer">¿No tienes cuenta? <span className="login-links"><Link to="/register">Regístrate</Link></span></p>
        </div>
      </div>
    </>
  );
}

export default Login;