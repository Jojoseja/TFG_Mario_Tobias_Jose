import "../styles/Dashboard.css";
import { useState } from "react";

function Dashboard() {
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

  const tasks = [
    { id: 1, title: "Preparar entrega del TFG", completed: false },
    { id: 2, title: "Repasar arquitectura frontend", completed: true },
    { id: 3, title: "Diseñar vista de estadísticas", completed: false },
    { id: 4, title: "Documentar casos de uso", completed: false },
  ];

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Bienvenido de nuevo</h1>
          <p>Gestiona tu tiempo y mantén el foco en tus objetivos.</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button className="secondary-button" onClick={testBackend}>
            Probar backend ⚡
          </button>
          <button className="primary-button">+ Nueva tarea</button>
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
        <div className="panel focus-panel">
          <div className="panel-header">
            <h2>Sesión actual</h2>
            <span className="status-badge">En progreso</span>
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

        <div className="panel tasks-panel">
          <div className="panel-header">
            <h2>Tareas pendientes</h2>
            <span>{tasks.length} tareas</span>
          </div>

          <div className="task-list">
            {tasks.map((task) => (
              <div className="task-item" key={task.id}>
                <div className="task-left">
                  <input type="checkbox" defaultChecked={task.completed} />
                  <span className={task.completed ? "completed" : ""}>
                    {task.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel progress-panel">
          <div className="panel-header">
            <h2>Progreso semanal</h2>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Estudio</span>
              <span>80%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill fill-80"></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Trabajo</span>
              <span>60%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill fill-60"></div>
            </div>
          </div>

          <div className="progress-item">
            <div className="progress-info">
              <span>Descanso</span>
              <span>40%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill fill-40"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Dashboard;