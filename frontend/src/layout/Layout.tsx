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

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    /* //TODO: Borrar esto en la entrega, es para mokear un proyecto
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Proyecto de prueba",
      description: "Este proyecto solo existe en modo desarrollo",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: "46d5b12e-7d10-457f-9baf-e4bb7f3c7d6e",
    }
      */
  ]);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectModalMode, setProjectModalMode] = useState<"create" | "edit">("create");
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  const user = getStoredUser();

  const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });
  

  //Descomentar para conectar los proyectos con el backend, se comenta para cuando quieres estar en modo dev solo con el front
  
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

  const handleLogout = () => {
    removeStoredUser();
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
