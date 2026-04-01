import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
  
    navigate("/dashboard");
  };

  return (
    <div>
      <h1>Login</h1>

      <input type="text" placeholder="Usuario" />
      <input type="password" placeholder="Contraseña" />

      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;