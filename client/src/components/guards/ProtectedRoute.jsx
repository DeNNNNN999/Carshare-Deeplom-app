import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
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

  // Если пользователь авторизован, отображаем защищенный контент
  return children;
};

export default ProtectedRoute;
