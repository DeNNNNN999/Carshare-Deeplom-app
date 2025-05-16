import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const { currentUser } = useAuth();

  // Если пользователь уже авторизован, перенаправляем на дашборд
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="m-auto w-full max-w-md p-6">
        <div className="bg-white shadow-card rounded-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
