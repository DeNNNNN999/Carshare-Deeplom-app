import { Link } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiTruck, FiCalendar, FiTag, 
  FiPercent, FiBarChart2, FiMenu, FiX, FiLogOut,
  FiUserPlus
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { path: '/admin', icon: FiHome, label: 'Главная' },
    { path: '/admin/users', icon: FiUsers, label: 'Пользователи' },
    { path: '/admin/users/new', icon: FiUserPlus, label: 'Добавить пользователя' },
    { path: '/admin/cars', icon: FiTruck, label: 'Автомобили' },
    { path: '/admin/bookings', icon: FiCalendar, label: 'Бронирования' },
    { path: '/admin/tariffs', icon: FiTag, label: 'Тарифы' },
    { path: '/admin/promotions', icon: FiPercent, label: 'Акции' },
    { path: '/admin/statistics', icon: FiBarChart2, label: 'Статистика' },
  ];

  return (
    <div 
      className={`lg:block fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col py-8 px-6">
        <Link to="/" className="text-2xl font-bold text-primary-700 mb-10">
          CarShare <span className="text-sm font-normal">Admin</span>
        </Link>
        
        <div className="mb-10">
          <div className="text-sm text-gray-600 mb-2">Администратор</div>
          <div className="text-lg font-semibold">
            {currentUser?.firstName} {currentUser?.lastName}
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <item.icon className="mr-3" />
              {item.label}
            </Link>
          ))}
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
            className="w-full text-left p-3 rounded-md text-gray-700 hover:bg-gray-100 flex items-center"
          >
            <FiLogOut className="mr-3" />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;