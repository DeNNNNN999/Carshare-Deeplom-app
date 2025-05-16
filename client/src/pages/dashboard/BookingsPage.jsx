import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../../api/services';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiFilter, FiX } from 'react-icons/fi';
import moment from 'moment';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Подготовка параметров для запроса
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.startDate = filters.dateFrom;
      if (filters.dateTo) params.endDate = filters.dateTo;
      
      const response = await bookingService.getUserBookings(params);
      setBookings(response.data.bookings || []);
    } catch (err) {
      setError('Не удалось загрузить бронирования. Пожалуйста, попробуйте позже.');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchBookings();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
    });
    setTimeout(() => {
      fetchBookings();
    }, 0);
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      await bookingService.cancelBooking(bookingId);
      // Обновляем список бронирований после отмены
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

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои бронирования</h1>
        <button 
          className="btn btn-outline flex items-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FiFilter className="mr-2" />
          Фильтры
        </button>
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
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="bg-white shadow rounded-lg overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between mb-4">
                  <div>
                    <Link 
                      to={`/bookings/${booking.id}`}
                      className="text-xl font-semibold hover:text-primary-600"
                    >
                      {booking.car?.brand} {booking.car?.model} ({booking.car?.year})
                    </Link>
                    <div className="text-gray-600 mt-1">
                      {booking.car?.registrationNumber}
                    </div>
                  </div>
                  
                  <div className="mt-2 md:mt-0 flex flex-wrap">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(booking.status)}`}
                    >
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center">
                    <FiCalendar className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Период аренды</div>
                      <div>{moment(booking.startDate).format('DD.MM.YYYY')} — {moment(booking.endDate).format('DD.MM.YYYY')}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiClock className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Длительность</div>
                      <div>{moment(booking.endDate).diff(moment(booking.startDate), 'days')} дней</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiDollarSign className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Стоимость</div>
                      <div>{Number(booking.totalCost).toFixed(2)} ₽</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-t pt-4">
                  <div className="flex items-center mb-2 md:mb-0">
                    <FiMapPin className="text-gray-500 mr-2" />
                    <span className="text-gray-600">Локация: {booking.car?.location || 'Не указана'}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      to={`/bookings/${booking.id}`}
                      className="btn btn-outline btn-sm"
                    >
                      Подробнее
                    </Link>
                    
                    {/* Показываем кнопку отмены только для бронирований в статусе "pending" или "confirmed" */}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button 
                        onClick={() => handleCancelBooking(booking.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Отменить
                      </button>
                    )}
                    
                    {/* Показываем кнопку продления только для активных бронирований */}
                    {booking.status === 'active' && (
                      <Link 
                        to={`/bookings/${booking.id}/extend`}
                        className="btn btn-primary btn-sm"
                      >
                        Продлить
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">У вас пока нет бронирований</div>
          <Link to="/search" className="btn btn-primary">
            Найти автомобиль
          </Link>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
