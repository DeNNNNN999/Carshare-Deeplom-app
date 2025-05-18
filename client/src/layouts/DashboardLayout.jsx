import { Outlet, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import ClientSidebar from '../components/ui/ClientSidebar';

const DashboardLayout = () => {
  const { currentUser, isManager } = useAuth();
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
      <ClientSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

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
