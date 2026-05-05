import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { IoChevronForward, IoAdd } from "react-icons/io5";
import { useEffect, useState } from "react";
import "../styles/Home.css";
import NewProjectModal from "../components/NewProjectModal";
import type { Project } from "../types/project";
import { MdDarkMode, MdDelete, MdEdit } from "react-icons/md";
import type { User } from "../types/user";
import { CiLight } from "react-icons/ci";

//TODO: Hay que hacer bien el modo claro

function Layout() {
  const navigate = useNavigate();

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Alemán",
      description: "Proyecto para aprender alemán",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
      tasks: [],
      pomodoroConfig: {
        workMinutes: 25,
        breakMinutes: 5
      }
    }
  ]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const storedUser = localStorage.getItem("user");

  const user: User | null = storedUser ? JSON.parse(storedUser) : null;

   const [lightMode, setLightMode] = useState(() => {
    return localStorage.getItem("theme") === "light";
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
     navigate("/login");
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects((prevProjects) => [...prevProjects, newProject]);

    // Abrir lista para que se vea el proyecto recién creado
    setProjectsOpen(true);

  };

  const handleDeleteProject = (projectToDelete: number) => {
    setProjects((prevProjects) =>
      prevProjects.filter((project) => project.id !== projectToDelete)
    );

    // Luego aquí irá el DELETE al backend:
    // DELETE http://localhost:8080/api/v1/projects/${projectToDelete}
  };

  const handleEditProject = (projectToEdit: number) => {
    // Aquí abriría un modal parecido al de creación, pero con los datos del proyecto ya cargados.
    // Luego haría un PUT al backend para actualizar el proyecto.
    console.log("Editar proyecto", projectToEdit);
  };

  useEffect(() => {
  if (lightMode) {
    document.body.classList.add("light-mode");
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    localStorage.setItem("theme", "dark");
  }
  }, [lightMode]);

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
                className="add-project-button"
                onClick={() => setIsProjectModalOpen(true)}
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
                        key={project.id}
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
                        onClick={() => console.log("Editar proyecto", project.id)}
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
        <Outlet context={{projects}}/>
      </main>

      <NewProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}

export default Layout;