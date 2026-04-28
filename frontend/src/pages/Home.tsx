import "../styles/Home.css";
import { useState } from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskManager from "../components/TaskManager";

type SessionStatus = "work" | "shortRest" | "longRest";

function Home() {
  const [backendMessage, setBackendMessage] = useState("");
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");

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

  //Variable para el proyecto actual en el que te encuentras
  const projectName = "Alemán";

  //Colores de sesión actual
  const currentBadgeStyle =
    sessionStatus === "work"
      ? {
          background: "rgba(243, 63, 50, 0.1)",
          color: "rgba(235, 10, 10, 0.815)",
          border: "1px solid rgba(255, 115, 115, 0.22)",
        }
      : sessionStatus === "shortRest"
      ? {
          background: "rgba(115, 216, 255, 0.10)",
          color: "#73d8ff",
          border: "1px solid rgba(115, 216, 255, 0.22)",
        }
      : {
          background: "rgba(168, 85, 247, 0.10)",
          color: "#a855f7",
          border: "1px solid rgba(168, 85, 247, 0.22)",
        };
  
  //Texto de la sesión actual
  const currentBadgeText =
    sessionStatus === "work"
      ? "En pomodoro"
      : sessionStatus === "shortRest"
      ? "En descanso corto"
      : "En descanso largo";

  //Texto del próximo modo
  const nextBadgeText =
    sessionStatus === "work"
      ? "Descanso"
      : "Pomodoro";

  const nextBadgeStyle =
    sessionStatus === "work"
      ? {
          background: "rgba(115, 216, 255, 0.10)",
          color: "#73d8ff",
          border: "1px solid rgba(115, 216, 255, 0.22)",
        }
      : {
          background: "rgba(243, 63, 50, 0.1)",
          color: "rgba(235, 10, 10, 0.815)",
          border: "1px solid rgba(255, 115, 115, 0.22)",
        };

  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Bienvenido de nuevo, 'user'</h1>
          <p>Gestiona tu tiempo y mantén el foco en tus objetivos.</p>
        </div>

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
            <h2>Modo actual</h2>
            <span className="status-badge" style={currentBadgeStyle}>
              {currentBadgeText}
            </span>
          </div>

          <div className="container-info-pomo">
            <div className="info-pomo">
              <h2>Proyecto</h2>
              <span>{projectName}</span>
            </div>

            <div className="info-pomo">
              <h2>Próximo modo</h2>
              <span className="status-badge" style={nextBadgeStyle}>
                {nextBadgeText}
              </span>
            </div>
          </div>

          <PomodoroTimer onModeChange={setSessionStatus} />
        </div>

        <TaskManager variant="home"/>
      </section>
    </>
  );
}

export default Home;