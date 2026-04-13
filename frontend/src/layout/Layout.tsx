import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import "../styles/Home.css";
import { useState } from "react";
import { IoChevronForward, IoChevronDown, IoAdd } from "react-icons/io5";

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
                <span className="projects-icon">{projectsOpen ? <IoChevronDown /> : <IoChevronForward />}</span>
              </button>
              <button className="add-project-button"
                onClick={() => alert("Funcionalidad de añadir proyecto aún no implementada")}
                type="button"
                title="Añadir nuevo proyecto">
                  <IoAdd />
              </button>
            </div>
            {projectsOpen && (
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
            )}
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
    </div>
  );
}

export default Layout;