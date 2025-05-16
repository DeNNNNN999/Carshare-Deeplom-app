import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiTruck, FiCalendar, FiCreditCard, 
  FiMenu, FiX 
} from 'react-icons/fi';

const ManagerLayout = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Мобильная навигация */}
      <div className="lg:hidden fixed w-full bg-white shadow-sm z-10 py-4 px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary-700">CarShare Manager</Link>
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
          <Link to="/" className="text-2xl font-bold text-primary-700 mb-10">CarShare <span className="text-sm font-normal">Manager</span></Link>
          
          <div className="mb-10">
            <div className="text-sm text-gray-600 mb-2">Менеджер</div>
            <div className="text-lg font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
          </div>
          
          <nav className="flex-1 space-y-2">
            <Link
              to="/manager"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiHome className="mr-3" />
              Главная
            </Link>
            <Link
              to="/manager/cars"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiTruck className="mr-3" />
              Автомобили
            </Link>
            <Link
              to="/manager/bookings"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiCalendar className="mr-3" />
              Бронирования
            </Link>
            <Link
              to="/manager/payments"
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <FiCreditCard className="mr-3" />
              Платежи
            </Link>
          </nav>
          
          <div className="pt-8 border-t border-gray-200">
            <Link 
              to="/dashboard"
              className="block w-full text-left p-3 rounded-md text-gray-700 hover:bg-gray-100 mb-2"
            >
              Панель пользователя
            </Link>
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

export default ManagerLayout;