import "../styles/Home.css";
import { useState } from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskManager from "../components/TaskManager";
import type { User } from "../types/user";

type SessionStatus = "work" | "shortRest" | "longRest";

function Home() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");

  const userStorage = localStorage.getItem("user");
  const user: User | null = userStorage ? JSON.parse(userStorage) : null;

  //Variable para el proyecto actual en el que te encuentras
  //TODO: Cambiar esto porque cargue el projecto y ponga el nombre del último proyecto trabajado, aun no sé como hacerlo, además que tampoco sé donde almacenar el proyecto (o si traerlo con una consulta)
  const projectName = "Alemán";

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


  return (
    <>
      <header className="dashboard-header">
        <div>
          <h1>Bienvenido de nuevo, {user?.username || "Usuario"}</h1>
          <p>Gestiona tu tiempo y mantén el foco en tus objetivos.</p>
        </div>
      </header>

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
            <span className={`status-badge status-badge--${sessionStatus}`}>
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
              <span
                className={`status-badge ${
                    sessionStatus === "work"
                        ? "status-badge--shortRest"
                        : "status-badge--work"
                }`}
              >
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
