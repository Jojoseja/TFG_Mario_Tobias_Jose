import "../styles/Home.css";
import {useEffect, useState} from "react";
import PomodoroTimer from "../components/PomodoroTimer";
import TaskManager from "../components/TaskManager";
import type { User } from "../types/user";
import type { Project } from "../types/project";
import { getStoredUser } from "../services/userStorageService";
import { getStoredLatestProject } from "../services/latestProjectStorageService";
import type {Statistics} from "../types/statistics.ts";
import {formatSeconds, getStatistics} from "../services/statisticsService.ts";

type SessionStatus = "work" | "shortRest" | "longRest";

function Home() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("work");
  const [statistics, setStatistics] = useState<Statistics | null>(null);


  const user: User | null = getStoredUser();
  const latestProject: Project | null = getStoredLatestProject();

  const projectName = latestProject?.name ?? "Sin proyecto";

  const currentBadgeText =
    sessionStatus === "work"
      ? "En pomodoro"
      : sessionStatus === "shortRest"
      ? "En descanso corto"
      : "En descanso largo";

  const nextBadgeText = sessionStatus === "work" ? "Descanso" : "Pomodoro";

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        const loadedStatistics = await getStatistics();
        setStatistics(loadedStatistics);
      } catch (error) {
        console.error("Error cargando estadísticas", error);
      }
    };

    void loadStatistics();
  }, []);

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
          <p>{formatSeconds(statistics?.timeToday)}</p>
          <span>Tiempo de concentracion</span>
        </div>

        <div className="stat-card">
          <h3>Pomodoros</h3>
          <p>{statistics?.pomodorosCompleted ?? "--"}</p>
          <span>Eres el mejor</span>
        </div>

        <div className="stat-card">
          <h3>Tareas completadas</h3>
          <p>{statistics?.taskCompleted ?? "--"}</p>
          <span>Sigue asi!!</span>
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

        <TaskManager variant="home" projectId={latestProject?.id ?? null} />
      </section>
    </>
  );
}

export default Home;
