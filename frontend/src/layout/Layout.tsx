import { NavLink, Outlet } from "react-router-dom";
import "../styles/Dashboard.css";

function Layout() {
  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">⏱</div>
          <div>
            <h2>Time to Focus</h2>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/ajustes" className={({ isActive }) => (isActive ? "active" : "")}>
            Ajustes
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>Usuario</p>
          <span>Sesión iniciada</span>
        </div>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;