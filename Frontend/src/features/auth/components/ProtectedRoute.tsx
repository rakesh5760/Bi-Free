import { Navigate, useLocation } from 'react-router';
import { useAuthStore, UserRole, StudentLevel } from '../../../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  allowedLevels?: StudentLevel[];
}

export function ProtectedRoute({ children, allowedRoles, allowedLevels }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role not authorized, redirect to their respective dashboard
    const dashboardRoutes: Record<UserRole, string> = {
      student: '/student',
      mentor: '/mentor',
      faculty: '/faculty',
      client: '/client',
      admin: '/admin',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  if (allowedLevels && user.role === 'student') {
    // Check if the student has the correct level
    if (!user.studentLevel || !allowedLevels.includes(user.studentLevel)) {
      return <Navigate to="/learning" replace />; // Redirect to learning portal if unqualified
    }
  }

  return <>{children}</>;
}
