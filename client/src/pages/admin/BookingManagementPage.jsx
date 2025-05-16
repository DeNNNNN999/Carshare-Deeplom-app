import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService, carService, userService } from '../../api/services';
import { FiCalendar, FiClock, FiDollarSign, FiUser, FiTruck, FiFilter, FiX, FiCheck, FiXCircle } from 'react-icons/fi';
import moment from 'moment';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    userId: '',
    carId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchUsersAndCars();
  }, [pagination.page, pagination.limit]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Подготовка параметров для запроса
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await bookingService.getAllBookings(params);
      setBookings(response.data.bookings || []);
      setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
    } catch (err) {
      setError('Не удалось загрузить бронирования. Пожалуйста, попробуйте позже.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersAndCars = async () => {
    try {
      // Получаем список пользователей для фильтрации
      const usersResponse = await userService.getAllUsers();
      setUsers(usersResponse.data.users || []);
      
      // Получаем список автомобилей для фильтрации
      const carsResponse = await carService.getCars();
      setCars(carsResponse.data.cars || []);
    } catch (err) {
      console.error('Error fetching users and cars:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    fetchBookings();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
      userId: '',
      carId: ''
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    setTimeout(() => {
      fetchBookings();
    }, 0);
  };

  const handleConfirmBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите подтвердить это бронирование?')) {
      return;
    }
    
    try {
      await bookingService.confirmBooking(bookingId);
      // Обновляем список бронирований
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось подтвердить бронирование');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить это бронирование?')) {
      return;
    }
    
    try {
      await bookingService.cancelBooking(bookingId);
      // Обновляем список бронирований
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось отменить бронирование');
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'confirmed': return 'Подтверждено';
      case 'active': return 'Активно';
      case 'completed': return 'Завершено';
      case 'cancelled': return 'Отменено';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление бронированиями</h1>
        <div className="flex space-x-2">
          <button 
            className="btn btn-outline flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            Фильтры
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Фильтры</h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          
          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все статусы</option>
                  <option value="pending">Ожидает подтверждения</option>
                  <option value="confirmed">Подтверждено</option>
                  <option value="active">Активно</option>
                  <option value="completed">Завершено</option>
                  <option value="cancelled">Отменено</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала (от)
                </label>
                <input
                  type="date"
                  name="dateFrom"
                  value={filters.dateFrom}
                  onChange={handleFilterChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата окончания (до)
                </label>
                <input
                  type="date"
                  name="dateTo"
                  value={filters.dateTo}
                  onChange={handleFilterChange}
                  className="input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Пользователь
                </label>
                <select
                  name="userId"
                  value={filters.userId}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все пользователи</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Автомобиль
                </label>
                <select
                  name="carId"
                  value={filters.carId}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все автомобили</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.registrationNumber})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                type="button" 
                onClick={resetFilters}
                className="btn btn-outline"
              >
                Сбросить
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Применить
              </button>
            </div>
          </form>
        </div>
      )}
      
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
        <>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between mb-4">
                      <div>
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-semibold">
                            Бронирование #{booking.id}
                          </h3>
                          <span 
                            className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(booking.status)}`}
                          >
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          Создано: {moment(booking.createdAt).format('DD.MM.YYYY HH:mm')}
                        </div>
                      </div>
                      
                      <div className="mt-2 md:mt-0 text-sm">
                        <span className="font-medium">Общая стоимость:</span> {Number(booking.totalCost).toFixed(2)} ₽
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <FiUser className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Клиент</div>
                          <div>
                            {booking.user?.firstName} {booking.user?.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.user?.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FiTruck className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Автомобиль</div>
                          <div>
                            {booking.car?.brand} {booking.car?.model}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.car?.registrationNumber}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FiCalendar className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Период аренды</div>
                          <div>
                            {moment(booking.startDate).format('DD.MM.YYYY HH:mm')} — {moment(booking.endDate).format('DD.MM.YYYY HH:mm')}
                          </div>
                          <div className="text-sm text-gray-600">
                            {moment(booking.endDate).diff(moment(booking.startDate), 'days')} дней
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-4">
                      <div className="mb-2 md:mb-0">
                        <div className="text-sm text-gray-600">Тарифный план:</div>
                        <div>{booking.rentalPlan?.name || 'Не указан'}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link 
                          to={`/admin/bookings/${booking.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          Подробнее
                        </Link>
                        
                        {booking.status === 'pending' && (
                          <button 
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="btn btn-primary btn-sm"
                          >
                            <FiCheck className="mr-1" />
                            Подтвердить
                          </button>
                        )}
                        
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button 
                            onClick={() => handleCancelBooking(booking.id)}
                            className="btn btn-danger btn-sm"
                          >
                            <FiXCircle className="mr-1" />
                            Отменить
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Пагинация */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Показано <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> из <span className="font-medium">{pagination.total}</span> бронирований
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.page === 1}
                    className={`btn btn-sm ${pagination.page === 1 ? 'btn-disabled' : 'btn-outline'}`}
                  >
                    Назад
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={pagination.page * pagination.limit >= pagination.total}
                    className={`btn btn-sm ${pagination.page * pagination.limit >= pagination.total ? 'btn-disabled' : 'btn-outline'}`}
                  >
                    Вперед
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">Бронирования не найдены</div>
              {Object.values(filters).some(v => v !== '') && (
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagementPage;
