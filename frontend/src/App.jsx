import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, ModeratorRoute, PublicRoute } from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import ModeratorDashboard from './pages/ModeratorDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Citizen routes */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/complaints/new" element={<PrivateRoute><NewComplaint /></PrivateRoute>} />
          <Route path="/complaints/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />

          {/* Moderator routes */}
          <Route path="/moderator" element={<ModeratorRoute><ModeratorDashboard /></ModeratorRoute>} />
          <Route path="/moderator/complaints" element={<ModeratorRoute><ModeratorDashboard /></ModeratorRoute>} />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
