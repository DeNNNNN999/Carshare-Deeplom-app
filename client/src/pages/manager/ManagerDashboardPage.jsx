import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, carService, paymentService } from '../../api/services';
import { useAuth } from '../../contexts/AuthContext';
import { Icon } from '@iconify/react';

const ManagerDashboardPage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    pendingBookings: 0,
    activeBookings: 0,
    pendingPayments: 0,
    availableCars: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Начинаем загрузку данных для дашборда менеджера');
        
        // Получение статистики по бронированиям
        console.log('Запрашиваем данные о бронированиях');
        const bookingsResponse = await bookingService.getAllBookings({ t: Date.now() }); // Добавляем время для предотвращения кеширования
        const bookings = bookingsResponse.data.bookings || [];
        console.log(`Получено ${bookings.length} бронирований`);
        
        // Получение статистики по автомобилям
        console.log('Запрашиваем данные об автомобилях');
        const carsResponse = await carService.getCars();
        const cars = carsResponse.data.cars || [];
        console.log(`Получено ${cars.length} автомобилей`);
        
        // Получение статистики по платежам
        console.log('Запрашиваем данные о платежах');
        const paymentsResponse = await paymentService.getAllPayments({ 
          status: 'pending',
          t: Date.now() // Добавляем время для предотвращения кеширования
        });
        const pendingPayments = paymentsResponse.data.payments || [];
        console.log(`Получено ${pendingPayments.length} платежей`);
        
        // Обновление статистики
        setStats({
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
          activeBookings: bookings.filter(b => b.status === 'active').length,
          pendingPayments: pendingPayments.length,
          availableCars: cars.filter(c => c.status === 'available').length
        });
        
        // Получение последних бронирований
        setRecentBookings(
          bookings
            .filter(b => b.status === 'pending' || b.status === 'active')
            .slice(0, 5)
        );
        
        console.log('Данные для дашборда менеджера успешно загружены');
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        toast.error('Ошибка при загрузке данных. Пожалуйста, обновите страницу.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
      <p className="text-gray-600 mb-8">Добро пожаловать, {currentUser?.firstName}!</p>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Icon icon="lucide:clock" className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Ожидают подтверждения</p>
                  <p className="text-2xl font-bold">{stats.pendingBookings}</p>
                </div>
              </div>
              <Link to="/manager/bookings" className="text-blue-600 text-sm font-medium mt-4 block hover:underline">
                Просмотреть все
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Icon icon="lucide:car" className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Активные аренды</p>
                  <p className="text-2xl font-bold">{stats.activeBookings}</p>
                </div>
              </div>
              <Link to="/manager/bookings" className="text-green-600 text-sm font-medium mt-4 block hover:underline">
                Просмотреть все
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <Icon icon="lucide:credit-card" className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Ожидают оплаты</p>
                  <p className="text-2xl font-bold">{stats.pendingPayments}</p>
                </div>
              </div>
              <Link to="/manager/payments" className="text-yellow-600 text-sm font-medium mt-4 block hover:underline">
                Просмотреть все
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Icon icon="lucide:check-circle" className="text-purple-600 text-xl" />
                </div>
                <div>
                  <p className="text-gray-500">Доступные автомобили</p>
                  <p className="text-2xl font-bold">{stats.availableCars}</p>
                </div>
              </div>
              <Link to="/manager/cars" className="text-purple-600 text-sm font-medium mt-4 block hover:underline">
                Просмотреть все
              </Link>
            </div>
          </div>
          
          {/* Быстрый доступ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Быстрый доступ</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link 
                  to="/booking/new" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="lucide:plus-circle" className="text-primary-600 mr-3 text-xl" />
                  <span>Создать бронирование</span>
                </Link>
                
                <Link 
                  to="/manager/bookings" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="lucide:list" className="text-primary-600 mr-3 text-xl" />
                  <span>Управление бронированиями</span>
                </Link>
                
                <Link 
                  to="/manager/payments" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="lucide:credit-card" className="text-primary-600 mr-3 text-xl" />
                  <span>Подтверждение платежей</span>
                </Link>
                
                <Link 
                  to="/manager/cars" 
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon icon="lucide:car" className="text-primary-600 mr-3 text-xl" />
                  <span>Управление автомобилями</span>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Последние бронирования</h2>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map(booking => (
                    <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">
                          {booking.car ? `${booking.car.brand} ${booking.car.model}` : `Автомобиль #${booking.carId}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'}`}
                        >
                          {booking.status === 'active' ? 'Активно' : 
                           booking.status === 'pending' ? 'Ожидает' : 
                           booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">Нет недавних бронирований</p>
              )}
            </div>
          </div>
          
          {/* Информация о личной аренде */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Хотите арендовать автомобиль?</h2>
            <p className="text-gray-600 mb-4">
              Как менеджер, вы также можете арендовать автомобиль для личного использования. 
              Воспользуйтесь всеми преимуществами нашего сервиса.
            </p>
            <div className="flex space-x-4">
              <Link to="/search" className="btn btn-primary">
                Найти автомобиль
              </Link>
              <Link to="/tariffs" className="btn btn-outline">
                Посмотреть тарифы
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerDashboardPage;