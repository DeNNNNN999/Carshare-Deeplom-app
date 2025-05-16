import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Если идет загрузка, возвращаем null или загрузочный индикатор
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>;
  }

  // Если пользователь не авторизован, перенаправляем на страницу логина
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Если пользователь не администратор, перенаправляем на страницу доступа запрещен
  if (!isAdmin()) {
    return <Navigate to="/dashboard" state={{ error: 'У вас нет доступа к этой странице' }} replace />;
  }

  // Если пользователь администратор, отображаем защищенный контент
  return children;
};

export default AdminRoute;
