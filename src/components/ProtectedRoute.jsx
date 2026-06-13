import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/AuthContext';
import { ProjectDetailSkeleton } from '@components/Skeleton';

export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
