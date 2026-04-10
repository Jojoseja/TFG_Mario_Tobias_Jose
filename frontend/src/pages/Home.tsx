import "../styles/Home.css";
import { useState } from "react";

function Home() {
  const [backendMessage, setBackendMessage] = useState("");

  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/hello");
      const data = await response.text();
      setBackendMessage(data);
    } catch (error) {
      console.error("Error conectando con backend:", error);
      setBackendMessage("Error al conectar con el backend");
    }
  };

  const projectName = "Alemán"; // Esto luego vendrá del backend o contexto global

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Bienvenido de nuevo, 'user'</h1>
          <p>Gestiona tu tiempo y mantén el foco en tus objetivos.</p>
        </div>

        {/* Botón para probar conexión con backend */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button className="secondary-button" onClick={testBackend}>
            Probar backend ⚡
          </button>
        </div>
      </header>

      {backendMessage && (
        <div className="backend-response">
          <p>{backendMessage}</p>
        </div>
      )}

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Tiempo hoy</h3>
          <p>03:24 h</p>
          <span>+45 min respecto a ayer</span>
        </div>

        <div className="stat-card">
          <h3>Pomodoros</h3>
          <p>7</p>
          <span>2 sesiones completadas esta mañana</span>
        </div>

        <div className="stat-card">
          <h3>Tareas completadas</h3>
          <p>12</p>
          <span>75% de progreso semanal</span>
        </div>
      </section>

      <section className="dashboard-main-grid">

        <div className="focus-panel">

          <div className="panel-header">
            <h2>Sesión actual</h2>
            <span className="status-badge">En progreso</span> {/* Puedes cambiar el color del badge según el estado */ }
          </div>
          <div className="container-info-pomo">
            <div className="info-pomo">
              <h2>Proyecto Actual:</h2>
              <span>{projectName}</span>
            </div>
            <div className="info-pomo">
              <h2>Próximo modo:</h2>
            <span className="status-badge">Pausa Longa jeje</span> {/* Esto luego vendrá del backend o contexto global */ }
            </div>
          </div>
          <div className="timer-circle">
            <div>
              <h3>24:32</h3>
              <p>Pomodoro activo</p>
            </div>
          </div>

          <div className="timer-actions">
            <button className="secondary-button">Pausar</button>
            <button className="primary-button">Finalizar</button>
          </div>

        </div>
        <div className="task-panel">

          <div className="task-panel-header">
            <h1>Lista de tareas</h1>
            <p>Apunta tus objetivos de la sesión.</p>
          </div>

          <div className="task-panel-list">
            <ul className="task-list">
              <li>
                <input type="checkbox" id="task1" />
                <label htmlFor="task1">Completar informe mensual</label>
              </li>
            </ul>
          </div>

          <div className="task-panel-footer">
            <input type="text" placeholder="Insertar nueva tarea..." />
            <button className="primary-button">Agregar tarea</button>
          </div>

        </div>

      </section>
    </>
  );
}

export default Home;