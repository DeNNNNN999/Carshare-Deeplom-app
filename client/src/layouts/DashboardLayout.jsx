import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiHome, FiUser, FiCalendar, FiCreditCard, FiStar, FiMenu, FiX } from 'react-icons/fi';

const DashboardLayout = () => {
  const { currentUser, logout, isManager } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Проверяем роль пользователя при загрузке компонента
  useEffect(() => {
    // Если пользователь является менеджером и пытается зайти не на свою страницу, перенаправляем его
    if (isManager() && window.location.pathname === '/payments') {
      navigate('/manager/payments');
    }
  }, [isManager, navigate]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Определяем правильный путь для дашборда в зависимости от роли
  const getDashboardPath = () => {
    return isManager() ? '/manager' : '/dashboard';
  };
  
  // Определяем правильный путь для платежей в зависимости от роли
  const getPaymentsPath = () => {
    return isManager() ? '/manager/payments' : '/payments';
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Мобильная навигация */}
      <div className="lg:hidden fixed w-full bg-white shadow-sm z-10 py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary-700">CarShare</Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Боковая панель */}
      <div 
        className={`lg:block fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="h-full flex flex-col py-8 px-6">
          <Link to="/" className="text-2xl font-bold text-primary-700 mb-10">CarShare</Link>
          
          <div className="mb-10">
            <div className="text-sm text-gray-600 mb-2">Добро пожаловать,</div>
            <div className="text-lg font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link
              to={getDashboardPath()}
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiHome className="mr-3" />
              Главная
            </Link>
            <Link
              to="/profile"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiUser className="mr-3" />
              Мой профиль
            </Link>
            <Link
              to="/bookings"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiCalendar className="mr-3" />
              Мои бронирования
            </Link>
            <Link
              to={getPaymentsPath()}
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiCreditCard className="mr-3" />
              Платежи
            </Link>
            <Link
              to="/reviews"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiStar className="mr-3" />
              Мои отзывы
            </Link>
          </nav>
          
          <div className="pt-8 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full text-left p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      {/* Основной контент */}
      <div className="lg:ml-64 flex flex-col flex-1 pt-16 lg:pt-0">
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
