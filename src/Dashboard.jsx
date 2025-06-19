import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import './Dahboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    // Here you would typically also clear any user session/tokens
    navigate('/login'); // Navigate to login page
  };

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="logo-section">
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <i className="icon">🍔</i>
          </button>
          <div className="logo-icon">🎓</div>
          <div className="logo-text">
            <h1>SemSync</h1>
            <p>Academic Companion</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="dash" className={location.pathname.includes("dash") ? "active" : ""}>
            <i className="icon">🧩</i> Dashboard
          </Link>
          <Link to="/dashboard/subjects" className={location.pathname.includes("subjects") ? "active" : ""}>
            <i className="icon">📖</i> Subjects
          </Link>
          <Link to="calendar" className={location.pathname.includes("calendar") ? "active" : ""}>
            <i className="icon">📅</i> Daily Tracker
          </Link>
          <Link to="quiz" className={location.pathname.includes("quiz") ? "active" : ""}>
            <i className="icon">🧠</i> Quiz Zone
          </Link>
          <Link to="/dashboard/doubt" className={location.pathname.includes("doubt") ? "active" : ""}>
            <i className="icon">🏆</i> Achievements
          </Link>
        </nav>

        <div className="header-right">
          <div className="theme-toggle">
            <i className="icon">🌙</i>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="icon">🚪</i> Logout
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${menuOpen ? 'active' : ''}`}>
          <button className="close-btn" onClick={() => setMenuOpen(false)}>
            <i className="icon">✕</i>
          </button>
          <nav className="nav-links">
            <Link to="dash" className={location.pathname.includes("dash") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              <i className="icon">🧩</i> Dashboard
            </Link>
            <Link to="/dashboard/subjects" className={location.pathname.includes("subjects") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              <i className="icon">📖</i> Subjects
            </Link>
            <Link to="calendar" className={location.pathname.includes("calendar") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              <i className="icon">📅</i> Daily Tracker
            </Link>
            <Link to="quiz" className={location.pathname.includes("quiz") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              <i className="icon">🧠</i> Quiz Zone
            </Link>
            <Link to="/dashboard/doubt" className={location.pathname.includes("doubt") ? "active" : ""} onClick={() => setMenuOpen(false)}>
              <i className="icon">🏆</i> Achievements
            </Link>
          </nav>
          <div className="header-right">
            <div className="theme-toggle">
              <i className="icon">🌙</i>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="icon">🚪</i> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;