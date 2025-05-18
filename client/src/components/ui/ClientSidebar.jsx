import { Link } from 'react-router-dom';
import { 
  FiHome, FiUser, FiCalendar, FiCreditCard, FiStar, 
  FiMenu, FiX, FiLogOut, FiTruck 
} from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';

const ClientSidebar = ({ sidebarOpen, toggleSidebar }) => {
  const { currentUser, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', icon: FiHome, label: 'Главная' },
    { path: '/profile', icon: FiUser, label: 'Мой профиль' },
    { path: '/bookings', icon: FiCalendar, label: 'Мои бронирования' },
    { path: '/payments', icon: FiCreditCard, label: 'Платежи' },
    { path: '/reviews', icon: FiStar, label: 'Мои отзывы' },
    { path: '/search-cars', icon: FiTruck, label: 'Найти автомобиль' },
  ];

  return (
    <div 
      className={`lg:block fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="h-full flex flex-col py-8 px-6">
        <Link to="/" className="text-2xl font-bold text-primary-700 mb-10">
          CarShare
        </Link>
        
        <div className="mb-10">
          <div className="text-sm text-gray-600 mb-2">Добро пожаловать,</div>
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

export default ClientSidebar;