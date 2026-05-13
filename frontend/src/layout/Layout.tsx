import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoChevronForward, IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import ProjectModal from "../components/ProjectModal";
import DeleteProjectModal from "../components/DeleteProjectModal";
import type { Project } from "../types/project";
import { MdDarkMode, MdDelete, MdEdit } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { getProjectsRequest } from "../services/projectService";
import { getStoredUser, removeStoredUser } from "../services/userStorageService";
import { finishSessionRequest } from "../services/sessionService";
import type { SessionRequest } from "../types/session";
import { secondsToRoundedMinutes } from "../utils/timeUtils";

type SessionStatus = "work" | "shortRest" | "longRest";

type UsedSecondsByStatus = Record<SessionStatus, number>;

type StoredPomodoroTimerState = {
  activeSessionId: string;
  sessionConfigurationId: string | null;
  usedSeconds: UsedSecondsByStatus;
};

const POMODORO_TIMER_STORAGE_KEY = "pomodoroTimerState";

function getPomodoroTimerStorageKey(userId: string): string {
  return `${POMODORO_TIMER_STORAGE_KEY}:${userId}`;
}

function getStoredPomodoroTimerStateForUser(
  userId: string
): StoredPomodoroTimerState | null {
  const storedState = localStorage.getItem(getPomodoroTimerStorageKey(userId));

  if (!storedState) return null;

  try {
    return JSON.parse(storedState) as StoredPomodoroTimerState;
  } catch (error) {
    console.error("Error leyendo el estado local del Pomodoro", error);
    localStorage.removeItem(getPomodoroTimerStorageKey(userId));
    return null;
  }
}

function clearStoredPomodoroTimerStateForUser(userId: string): void {
  localStorage.removeItem(getPomodoroTimerStorageKey(userId));
}

function buildLogoutFinishSessionRequest(
  sessionConfigurationId: string,
  usedSeconds: UsedSecondsByStatus
): SessionRequest {
  return {
    sessionConfigurationId,
    endedAt: new Date().toISOString(),
    workMinutesUsed: secondsToRoundedMinutes(usedSeconds.work),
    shortBreakDurationUsed: secondsToRoundedMinutes(usedSeconds.shortRest),
    longBreakDurationUsed: secondsToRoundedMinutes(usedSeconds.longRest),
    pomodoros: [],
  };
}

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isSettingsPage = location.pathname.startsWith("/ajustes");

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<"create" | "edit">("create");
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  const user = getStoredUser();

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });
  


  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await getProjectsRequest();
        setProjects(loadedProjects);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      }
    };

    void loadProjects();
  }, []);
  
  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      if (user?.id) {
        const storedTimerState = getStoredPomodoroTimerStateForUser(user.id);

        if (
          storedTimerState?.activeSessionId &&
          storedTimerState.sessionConfigurationId
        ) {
          await finishSessionRequest(
            storedTimerState.activeSessionId,
            buildLogoutFinishSessionRequest(
              storedTimerState.sessionConfigurationId,
              storedTimerState.usedSeconds
            )
          );
        }

        clearStoredPomodoroTimerStateForUser(user.id);
      }
    } catch (error) {
      console.error("Error finalizando la sesión Pomodoro al cerrar sesión", error);
    } finally {
      // Limpieza de la clave antigua usada antes de separar el estado por usuario.
      localStorage.removeItem(POMODORO_TIMER_STORAGE_KEY);
      removeStoredUser();
      navigate("/login", { replace: true });
      setIsLoggingOut(false);
    }
  };

  const openCreateProjectModal = () => {
    setProjectModalMode("create");
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setProjectModalMode("edit");
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setProjectsOpen(true);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectId)
    );
  };

  return (
    <div className="home-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">⏱</div>
          <div>
            <h2>Time to Focus</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/home"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>

          <div className="projects-section">
            <div className="projects-header">
              <button
                className="projects-toggle"
                onClick={() => setProjectsOpen(!projectsOpen)}
                type="button"
              >
                Proyectos
                <span className={`projects-icon ${projectsOpen ? "open" : ""}`}>
                  <IoChevronForward />
                </span>
              </button>

              <button
                className="project-button"
                onClick={openCreateProjectModal}
                type="button"
                title="Añadir nuevo proyecto"
              >
                <IoAdd />
              </button>
            </div>

            <div className={`projects-list-wrapper ${projectsOpen ? "open" : ""}`}>
              <div className="projects-list">
                {projects.length === 0 ? (
                  <p className="empty-projects">No hay proyectos todavía</p>
                ) : (
                  projects.map((project) => (
                    <div key={project.id} className="project-item-row">
                      <button
                        className={`project-item ${
                          location.pathname === `/proyecto/${project.id}` ? "active" : ""
                        }`}
                        type="button"
                        onClick={() => navigate(`/proyecto/${project.id}`)}
                      >
                        {project.name}
                      </button>

                      <button
                        className="edit-project-button"
                        type="button"
                        title="Editar proyecto"
                        onClick={() => openEditProjectModal(project)}
                      >
                        <MdEdit />
                      </button>

                      <button
                        className="delete-project-button"
                        type="button"
                        title="Eliminar proyecto"
                        onClick={() => setProjectToDelete(project)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <NavLink
            to="/ajustes"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Ajustes
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <p>{user?.username}</p>
          </div>

          <button
            className="theme-toggle-button"
            title="Establecer modo claro/oscuro"
            type="button"
            onClick={() => setLightMode(!lightMode)}
          >
            {lightMode ? <CiLight /> : <MdDarkMode />}
          </button>

          <button
            className="logout-button"
            onClick={() => void handleLogout()}
            title={isLoggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
            type="button"
            disabled={isLoggingOut}
          >
            <IoIosLogOut />
          </button>
        </div>
      </aside>

      <main
        className={`dashboard-content ${
          isSettingsPage ? "dashboard-content--scrollable" : ""
        }`}
      >
        <Outlet context={{ projects }} />
      </main>

      <ProjectModal
        open={isProjectModalOpen}
        mode={projectModalMode}
        projectToEdit={projectToEdit}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
      />

      <DeleteProjectModal
        open={projectToDelete !== null}
        projectToDelete={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onDeleteProject={handleDeleteProject}
      />
    </div>
  );
}

export default Layout;
