import { useState, useEffect } from 'react';
import { statisticsService } from '../../api/services';
import { FiUsers, FiTruck, FiDollarSign, FiCalendar, FiBarChart2 } from 'react-icons/fi';
import moment from 'moment';

const StatisticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('month'); // 'day', 'week', 'month', 'year'
  const [statsType, setStatsType] = useState('overview'); // 'overview', 'users', 'cars', 'revenue', 'long-term'
  
  const [overviewStats, setOverviewStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [carStats, setCarStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);
  const [longTermStats, setLongTermStats] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [period, statsType]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const params = { period };
      
      // Загружаем статистику в зависимости от выбранного типа
      if (statsType === 'overview' || statsType === 'all') {
        const overviewResponse = await statisticsService.getOverviewStats(params);
        setOverviewStats(overviewResponse.data);
      }
      
      if (statsType === 'users' || statsType === 'all') {
        const userResponse = await statisticsService.getUserStats(params);
        setUserStats(userResponse.data);
      }
      
      if (statsType === 'cars' || statsType === 'all') {
        const carResponse = await statisticsService.getCarStats(params);
        setCarStats(carResponse.data);
      }
      
      if (statsType === 'revenue' || statsType === 'all') {
        const revenueResponse = await statisticsService.getRevenueStats(params);
        setRevenueStats(revenueResponse.data);
      }
      
      if (statsType === 'long-term' || statsType === 'all') {
        const longTermResponse = await statisticsService.getLongTermStats(params);
        setLongTermStats(longTermResponse.data);
      }
    } catch (err) {
      setError('Не удалось загрузить статистику. Пожалуйста, попробуйте позже.');
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const handleStatsTypeChange = (type) => {
    setStatsType(type);
  };

  // Форматирование чисел для отображения
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Статистика и отчеты</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <button 
            className={`btn ${statsType === 'overview' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStatsTypeChange('overview')}
          >
            Общая
          </button>
          <button 
            className={`btn ${statsType === 'users' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStatsTypeChange('users')}
          >
            Пользователи
          </button>
          <button 
            className={`btn ${statsType === 'cars' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStatsTypeChange('cars')}
          >
            Автомобили
          </button>
          <button 
            className={`btn ${statsType === 'revenue' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStatsTypeChange('revenue')}
          >
            Доходы
          </button>
          <button 
            className={`btn ${statsType === 'long-term' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => handleStatsTypeChange('long-term')}
          >
            Долгоср. аренды
          </button>
        </div>
        
        <div>
          <select
            value={period}
            onChange={handlePeriodChange}
            className="input"
          >
            <option value="day">За день</option>
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="year">За год</option>
            <option value="all">За все время</option>
          </select>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : (
        <div>
          {/* Общая статистика */}
          {(statsType === 'overview' || statsType === 'all') && overviewStats && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Общая статистика</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <FiUsers className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Пользователей</p>
                      <p className="text-xl font-bold">{formatNumber(overviewStats.totalUsers)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FiTruck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Автомобилей</p>
                      <p className="text-xl font-bold">{formatNumber(overviewStats.totalCars)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                      <FiCalendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Бронирований</p>
                      <p className="text-xl font-bold">{formatNumber(overviewStats.totalBookings)}</p>
                      <p className="text-sm text-gray-500">Активных: {formatNumber(overviewStats.activeBookings)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 mr-4">
                      <FiBarChart2 className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Статусы бронирований</p>
                      <div className="text-sm">
                        <p>Активных: <span className="font-medium">{overviewStats.bookingsByStatus?.active || 0}</span></p>
                        <p>Ожидающих: <span className="font-medium">{overviewStats.bookingsByStatus?.pending || 0}</span></p>
                        <p>Завершенных: <span className="font-medium">{overviewStats.bookingsByStatus?.completed || 0}</span></p>
                        <p>Отмененных: <span className="font-medium">{overviewStats.bookingsByStatus?.cancelled || 0}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Статистика по пользователям */}
          {(statsType === 'users' || statsType === 'all') && userStats && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Статистика по пользователям</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <FiUsers className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Всего пользователей</p>
                      <p className="text-xl font-bold">{formatNumber(userStats.totalUsers)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FiUsers className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Активных пользователей</p>
                      <p className="text-xl font-bold">{formatNumber(userStats.activeUsers)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                      <FiUsers className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Верифицированных</p>
                      <p className="text-xl font-bold">{formatNumber(userStats.verifiedUsers)}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round((userStats.verifiedUsers / userStats.totalUsers) * 100)}% от общего числа
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* График регистраций по месяцам */}
              {userStats.usersByMonth && userStats.usersByMonth.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Новые пользователи по месяцам</h3>
                  
                  <div className="h-64 flex items-end space-x-2">
                    {userStats.usersByMonth.map((item, index) => {
                      const maxCount = Math.max(...userStats.usersByMonth.map(item => item.count));
                      const heightPercent = (item.count / maxCount) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-blue-500 rounded-t" 
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                          <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                          <div className="text-xs font-medium">{item.count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Статистика по автомобилям */}
          {(statsType === 'cars' || statsType === 'all') && carStats && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Статистика по автомобилям</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FiTruck className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Всего автомобилей</p>
                      <p className="text-xl font-bold">{formatNumber(carStats.totalCars)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 mr-4">
                      <FiBarChart2 className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Статусы автомобилей</p>
                      <div className="text-sm">
                        <p>Доступных: <span className="font-medium">{carStats.carsByStatus?.available || 0}</span></p>
                        <p>В аренде: <span className="font-medium">{carStats.carsByStatus?.rented || 0}</span></p>
                        <p>На ТО: <span className="font-medium">{carStats.carsByStatus?.maintenance || 0}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Популярные автомобили */}
              {carStats.popularCars && carStats.popularCars.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Самые популярные автомобили</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество бронирований</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% от общего</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {carStats.popularCars.map((car) => (
                          <tr key={car.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {car.brand} {car.model}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{car.totalBookings}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {Math.round((car.totalBookings / overviewStats.totalBookings) * 100)}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Статистика по доходам */}
          {(statsType === 'revenue' || statsType === 'all') && revenueStats && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Статистика по доходам</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FiDollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Общий доход</p>
                      <p className="text-xl font-bold">{formatNumber(revenueStats.totalRevenue)} ₽</p>
                      {revenueStats.revenueGrowth && (
                        <div className={`text-sm ${revenueStats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {revenueStats.revenueGrowth >= 0 ? '+' : ''}{revenueStats.revenueGrowth}% к прошлому периоду
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* График доходов по месяцам */}
              {revenueStats.monthlyRevenue && revenueStats.monthlyRevenue.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Доходы по месяцам</h3>
                  
                  <div className="h-64 flex items-end space-x-2">
                    {revenueStats.monthlyRevenue.map((item, index) => {
                      const maxRevenue = Math.max(...revenueStats.monthlyRevenue.map(item => item.revenue));
                      const heightPercent = (item.revenue / maxRevenue) * 100;
                      
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-green-500 rounded-t" 
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                          <div className="text-xs text-gray-600 mt-1">{item.month}</div>
                          <div className="text-xs font-medium">{formatNumber(item.revenue / 1000)}K</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* Доходы по тарифным планам */}
              {revenueStats.revenueByPlan && revenueStats.revenueByPlan.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-semibold mb-3">Доходы по тарифным планам</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тарифный план</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Доход</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% от общего</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {revenueStats.revenueByPlan.map((plan, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {plan.plan}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatNumber(plan.revenue)} ₽</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {Math.round((plan.revenue / revenueStats.totalRevenue) * 100)}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Статистика по долгосрочной аренде */}
          {(statsType === 'long-term' || statsType === 'all') && longTermStats && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Статистика по долгосрочной аренде</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 mr-4">
                      <FiCalendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Количество долгосрочных аренд</p>
                      <p className="text-xl font-bold">{formatNumber(longTermStats.totalLongTermBookings)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 mr-4">
                      <FiClock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Средняя продолжительность</p>
                      <p className="text-xl font-bold">{longTermStats.averageDuration.toFixed(1)} дней</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <FiDollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500">Доход от долгосрочной аренды</p>
                      <p className="text-xl font-bold">{formatNumber(longTermStats.totalRevenue)} ₽</p>
                      {revenueStats && (
                        <p className="text-sm text-gray-500">
                          {Math.round((longTermStats.totalRevenue / revenueStats.totalRevenue) * 100)}% от общего дохода
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Популярные автомобили для долгосрочной аренды */}
              {longTermStats.popularCars && longTermStats.popularCars.length > 0 && (
                <div className="bg-white shadow rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Популярные автомобили для долгосрочной аренды</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Количество бронирований</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% от общего</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {longTermStats.popularCars.map((car) => (
                          <tr key={car.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">
                                {car.brand} {car.model}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{car.totalBookings}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {Math.round((car.totalBookings / longTermStats.totalLongTermBookings) * 100)}%
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;
