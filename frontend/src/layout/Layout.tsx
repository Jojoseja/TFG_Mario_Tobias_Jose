import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoChevronForward, IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import ProjectModal from "../components/ProjectModal";
import type { Project } from "../types/project";
import { MdDarkMode, MdDelete, MdEdit } from "react-icons/md";
import type { User } from "../types/User";
import { CiLight } from "react-icons/ci";
import { ApiConstants } from "../constants/ApiConstants";

// TODO: Hay que hacer bien el modo claro
// TODO: Hay que editar el css para que cuando estes en un proyecto se quede marcado su nombre
// TODO: La notificación que sale debería ser algo más acorde a la estética de la web y no un pop up de google

function Layout() {
  const navigate = useNavigate();

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Proyecto de prueba",
      description: "Este proyecto solo existe en modo desarrollo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: "46d5b12e-7d10-457f-9baf-e4bb7f3c7d6e",
    }
  ]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<"create" | "edit">("create");
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  //Descomentar para conectar los proyectos con el backend, se comenta para cuando quieres estar en modo dev solo con el front
  /*
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const loadedProjects = await cargarProyectos();
        setProjects(loadedProjects);
      } catch (error) {
        console.error("Error cargando proyectos", error);
      }
    };

    loadProjects();
  }, []);
  */
  useEffect(() => {
    if (lightMode) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  }, [lightMode]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
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

  const handleDeleteProject = async (projectToDelete: string) => {
    const confirmed = window.confirm("¿Seguro que quieres eliminar este proyecto?");
    if (!confirmed) return;

    try {
      await deleteProjectEndpoint(projectToDelete);

      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectToDelete)
      );
    } catch (error) {
      console.error("Error eliminando proyecto", error);
    }
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
                        className="project-item"
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
                        onClick={() => handleDeleteProject(project.id)}
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
            onClick={handleLogout}
            title="Cerrar sesión"
            type="button"
          >
            <IoIosLogOut />
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
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
    </div>
  );
}

async function cargarProyectos(): Promise<Project[]> {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.id) {
    console.error("No se ha encontrado ningún id guardado");
    return [];
  }

  const response = await fetch(ApiConstants.PROJECT_PATH, {
    method: "GET",
    headers: {
      [ApiConstants.USER_ID_HEADER]: user.id,
    },
  });

  if (!response.ok) {
    throw new Error(`Error cargando proyectos: ${response.status}`);
  }

  const projects: Project[] = await response.json();
  return projects;
}

async function deleteProjectEndpoint(projectId: string): Promise<void> {
  const storedUser = localStorage.getItem("user");
  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

  if (!user?.id) {
    throw new Error("No se ha encontrado ningún id de usuario guardado");
  }

  const response = await fetch(`${ApiConstants.PROJECT_PATH}/${projectId}`, {
    method: "DELETE",
    headers: {
      [ApiConstants.USER_ID_HEADER]: user.id,
    },
  });

  if (!response.ok) {
    throw new Error(`Error eliminando proyecto: ${response.status}`);
  }
}

export default Layout;