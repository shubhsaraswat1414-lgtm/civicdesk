import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── PrivateRoute: must be logged in ──────────────────────────────
export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// ─── ModeratorRoute: must be moderator ────────────────────────────
export const ModeratorRoute = ({ children }) => {
  const { user, loading, isModerator } = useAuth();

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isModerator) return <Navigate to="/dashboard" replace />;
  return children;
};

// ─── PublicRoute: redirect if already logged in ──────────────────
export const PublicRoute = ({ children }) => {
  const { user, loading, isModerator } = useAuth();

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;
  if (user) return <Navigate to={isModerator ? '/moderator' : '/dashboard'} replace />;
  return children;
};
