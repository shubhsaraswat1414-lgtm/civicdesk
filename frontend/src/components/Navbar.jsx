import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isModerator } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isModerator ? '/moderator' : '/dashboard'} className="brand-link">
          <span className="brand-icon">🏛️</span>
          <span className="brand-name">CivicDesk</span>
        </Link>
      </div>

      <div className="navbar-links">
        {isModerator ? (
          <>
            <Link to="/moderator" className={`nav-link ${isActive('/moderator') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <Link to="/moderator/complaints" className={`nav-link ${isActive('/moderator/complaints') ? 'active' : ''}`}>
              All Complaints
            </Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
              My Complaints
            </Link>
            <Link to="/complaints/new" className={`nav-link ${isActive('/complaints/new') ? 'active' : ''}`}>
              + Raise Complaint
            </Link>
          </>
        )}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <span className="user-avatar">{user?.name?.[0]?.toUpperCase()}</span>
          <div className="user-details">
            <span className="user-name">{user?.name}</span>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
