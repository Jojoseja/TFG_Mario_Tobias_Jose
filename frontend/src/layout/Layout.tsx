import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import "../styles/Home.css";

function Layout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Aquí luego podrás borrar token, localStorage, etc.
    navigate("/");
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
          <NavLink to="/home" className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
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