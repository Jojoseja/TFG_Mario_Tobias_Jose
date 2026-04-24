import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import "../styles/Home.css";
import { useState } from "react";
import { IoChevronForward, IoAdd } from "react-icons/io5";
import NewProjectModal from "../components/NewProjectModal";

function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Aquí luego podrás borrar token, localStorage, etc.
    navigate("/");
  };

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projects, setProjects] = useState([
    "Alemán",
    "Inglés",
    "Operaciones multidimensionales con cáculos algebráicos, trigonométricos y logarítmicos",
  ]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  
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
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <div className="projects-section">
            <div className="projects-header">
              <button className="projects-toggle" 
                onClick={()=> setProjectsOpen(!projectsOpen)} 
                type="button">
                  Proyectos
                    <span className={`projects-icon ${projectsOpen ? "open" : ""}`}>
                      <IoChevronForward />
                    </span>
                  </button>
              
              <button 
                className="add-project-button"
                onClick={() => setIsProjectModalOpen(true)}
                type="button"
                title="Añadir nuevo proyecto">
                  <IoAdd />
              </button>
            </div>

            <div className={`projects-list-wrapper ${projectsOpen ? "open" : ""}`}>
                <div className="projects-list">
                  {projects.map((project, index) => (
                    <button
                      key={index}
                      className="project-item"
                      type="button"
                    >
                      {project}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          <NavLink to="/ajustes" className={({ isActive }) => (isActive ? "active" : "")}>
            Ajustes
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user-info">
            <p>Usuario</p>
            <span>Sesión iniciada</span>
          </div>
          
          <button className="logout-button" onClick={handleLogout} title="Cerrar sesión">
            <IoIosLogOut />
          </button>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
      <NewProjectModal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}

export default Layout;