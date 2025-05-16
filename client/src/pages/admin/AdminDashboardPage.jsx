import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { statisticsService } from '../../api/services';
import { Icon } from '@iconify/react';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    revenueGrowth: 0,
    activeBookings: 0,
    userGrowth: 0,
    popularCars: [],
    monthlyRevenue: [],
    bookingsByStatus: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Получение общей статистики
      const overviewResponse = await statisticsService.getOverviewStats();

      // Получение статистики по доходам
      const revenueResponse = await statisticsService.getRevenueStats();

      // Получение статистики по автомобилям
      const carResponse = await statisticsService.getCarStats();

      // Получение статистики по пользователям
      const userResponse = await statisticsService.getUserStats();

      // Объединяем все данные
      setStats({
        totalUsers: userResponse.data.totalUsers || 0,
        totalCars: carResponse.data.totalCars || 0,
        totalBookings: overviewResponse.data.totalBookings || 0,
        totalRevenue: revenueResponse.data.totalRevenue || 0,
        revenueGrowth: revenueResponse.data.revenueGrowth || 0,
        activeBookings: overviewResponse.data.activeBookings || 0,
        userGrowth: userResponse.data.userGrowth || 0,
        popularCars: carResponse.data.popularCars || [],
        monthlyRevenue: revenueResponse.data.monthlyRevenue || [],
        bookingsByStatus: overviewResponse.data.bookingsByStatus || {}
      });
    } catch (err) {
      setError('Не удалось загрузить данные дашборда. Пожалуйста, попробуйте позже.');
      console.error('Error fetching dashboard data:', err);

      // Заполняем демо-данными в случае ошибки
      setStats({
        totalUsers: 126,
        totalCars: 45,
        totalBookings: 312,
        totalRevenue: 1258400,
        revenueGrowth: 12.5,
        activeBookings: 28,
        userGrowth: 8.2,
        popularCars: [
          { id: 1, brand: 'Toyota', model: 'Camry', totalBookings: 48 },
          { id: 2, brand: 'BMW', model: 'X5', totalBookings: 42 },
          { id: 3, brand: 'Tesla', model: 'Model 3', totalBookings: 37 },
          { id: 4, brand: 'Mercedes', model: 'E-Class', totalBookings: 31 },
          { id: 5, brand: 'Audi', model: 'A4', totalBookings: 28 }
        ],
        monthlyRevenue: [
          { month: 'Янв', revenue: 89600 },
          { month: 'Фев', revenue: 76400 },
          { month: 'Мар', revenue: 102300 },
          { month: 'Апр', revenue: 94500 },
          { month: 'Май', revenue: 108700 },
          { month: 'Июн', revenue: 125600 }
        ],
        bookingsByStatus: {
          active: 28,
          completed: 264,
          pending: 12,
          cancelled: 8
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Панель управления</h1>

      {error && <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Основные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Icon icon="mdi:account-multiple" className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500">Всего пользователей</p>
              <div className="flex items-center">
                <p className="text-xl font-bold">{stats.totalUsers}</p>
                {stats.userGrowth > 0 && (
                  <div className="flex items-center ml-2 text-green-600">
                    <Icon icon="mdi:trending-up" className="mr-1" />
                    <span className="text-sm">+{stats.userGrowth}%</span>
                  </div>
                )}
                {stats.userGrowth < 0 && (
                  <div className="flex items-center ml-2 text-red-600">
                    <Icon icon="mdi:trending-down" className="mr-1" />
                    <span className="text-sm">{stats.userGrowth}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <Icon icon="mdi:car" className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500">Всего автомобилей</p>
              <p className="text-xl font-bold">{stats.totalCars}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <Icon icon="mdi:calendar" className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500">Всего бронирований</p>
              <p className="text-xl font-bold">{stats.totalBookings}</p>
              <p className="text-sm text-gray-500">Активных: {stats.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 mr-4">
              <Icon icon="mdi:currency-usd" className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-gray-500">Общий доход</p>
              <div className="flex items-center">
                <p className="text-xl font-bold">{Number(stats.totalRevenue).toLocaleString()} ₽</p>
                {stats.revenueGrowth > 0 && (
                  <div className="flex items-center ml-2 text-green-600">
                    <Icon icon="mdi:trending-up" className="mr-1" />
                    <span className="text-sm">+{stats.revenueGrowth}%</span>
                  </div>
                )}
                {stats.revenueGrowth < 0 && (
                  <div className="flex items-center ml-2 text-red-600">
                    <Icon icon="mdi:trending-down" className="mr-1" />
                    <span className="text-sm">{stats.revenueGrowth}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика бронирований */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Статистика бронирований</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-green-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Активные</p>
              <p className="text-lg font-semibold text-green-700">{stats.bookingsByStatus.active || 0}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Завершенные</p>
              <p className="text-lg font-semibold text-blue-700">{stats.bookingsByStatus.completed || 0}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Ожидающие</p>
              <p className="text-lg font-semibold text-yellow-700">{stats.bookingsByStatus.pending || 0}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-3 text-center">
              <p className="text-sm text-gray-600">Отмененные</p>
              <p className="text-lg font-semibold text-red-700">{stats.bookingsByStatus.cancelled || 0}</p>
            </div>
          </div>

          <div className="mt-4">
            <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              Подробная статистика
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Ежемесячный доход</h2>

          <div className="h-64 flex items-end space-x-2">
            {stats.monthlyRevenue.map((item, index) => {
              const maxRevenue = Math.max(...stats.monthlyRevenue.map(item => item.revenue))
              const heightPercent = (item.revenue / maxRevenue) * 100

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-primary-500 rounded-t" style={{ height: `${heightPercent}%` }}></div>
                  <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                  <div className="text-xs font-medium">{Number(item.revenue / 1000).toFixed(0)}K</div>
                </div>
              )
            })}
          </div>

          <div className="mt-4">
            <Link to="/admin/statistics" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
              Подробная статистика
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Популярные автомобили */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Популярные автомобили</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Автомобиль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Количество бронирований
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.popularCars.map(car => (
                <tr key={car.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {car.brand} {car.model}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{car.totalBookings}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Link to={`/admin/cars/${car.id}`} className="text-primary-600 hover:text-primary-800 mr-3">
                      Детали
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link to="/admin/cars" className="text-primary-600 hover:text-primary-800 text-sm flex items-center">
            Управление автопарком
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>

      {/* Быстрые действия */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Быстрые действия</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users" className="btn btn-outline h-auto py-4 flex flex-col items-center justify-center">
            <Icon icon="mdi:account-multiple" className="h-6 w-6 mb-2" />
            <span>Управление пользователями</span>
          </Link>

          <Link to="/admin/cars" className="btn btn-outline h-auto py-4 flex flex-col items-center justify-center">
            <Icon icon="mdi:car" className="h-6 w-6 mb-2" />
            <span>Управление автопарком</span>
          </Link>

          <Link to="/admin/bookings" className="btn btn-outline h-auto py-4 flex flex-col items-center justify-center">
            <Icon icon="mdi:calendar" className="h-6 w-6 mb-2" />
            <span>Управление бронированиями</span>
          </Link>

          <Link
            to="/admin/statistics"
            className="btn btn-outline h-auto py-4 flex flex-col items-center justify-center">
            <Icon icon="mdi:chart-bar" className="h-6 w-6 mb-2" />
            <span>Отчеты и статистика</span>
          </Link>
        </div>
      </div>
    </div>
  )
};

export default AdminDashboardPage;
