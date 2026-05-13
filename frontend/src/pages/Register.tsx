import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useState } from "react";
import { registerRequest } from "../services/authService";
import { saveStoredUser } from "../services/userStorageService";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [notification, setNotification] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); //Cancela la acción por defecto del formulario

     // Validación básica de campos
    if (!email || !username || !password || !confirmPassword) {

      setNotification({
        type: "error",
        text: "Por favor, completa todos los campos."
      });

      setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return;
    }

    if (password !== confirmPassword) {
    setNotification({
      type: "error",
      text: "Las contraseñas no coinciden."
    });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
    return;
    }

    try {
      const user = await registerRequest({
        username,
        email,
        password,
      });

      saveStoredUser(user);

      setNotification({
        type: "success",
        text: "Usuario registrado exitosamente.",
      });

      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (error) {
      console.error("Error creando usuario:", error);

      setNotification({
        type: "error",
        text: "Error al registrar el usuario. Por favor, intenta nuevamente.",
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
          <h1>Registro de usuario</h1>
          <p>Un paso más cerca de alcanzar tus objetivos.</p>
        </div>

        <form className="login-form" onSubmit={handleRegister}>
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
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input 
              id="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="login-button">Registrar</button>
        </form>

        <p className="login-footer">¿Ya tienes cuenta? <span className="login-links"><Link to="/login">Inicia sesión</Link></span></p>
      </div>
    </div>
    </>
  );
}

export default Register;