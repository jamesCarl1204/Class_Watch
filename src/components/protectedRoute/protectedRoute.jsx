import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { teacher, loading } = useAuth();
  if (loading) return null;
  return teacher ? <Outlet /> : <Navigate to="/login" replace />;
}

export function GuestRoute() {
  const { teacher, loading } = useAuth();
  if (loading) return null;
  return teacher ? <Navigate to="/dashboard" replace /> : <Outlet />;
}