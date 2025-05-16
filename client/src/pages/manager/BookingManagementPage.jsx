import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { bookingService } from '../../api/services';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const BookingManagementPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`Запрашиваем бронирования со статусом: ${filter || 'все'}`);
      const response = await bookingService.getAllBookings({ 
        status: filter !== 'all' ? filter : null,
        t: Date.now() // Добавляем время, чтобы избежать кеширования
      });
      console.log('Получено данных:', response.data);
      setBookings(response.data.bookings || []);
    } catch (err) {
      console.error('Ошибка при загрузке бронирований:', err);
      setError('Не удалось загрузить бронирования. Пожалуйста, попробуйте позже.');
      toast.error('Не удалось загрузить бронирования');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = async (id) => {
    try {
      await bookingService.confirmBooking(id);
      toast.success('Бронирование подтверждено');
      fetchBookings();
    } catch (err) {
      console.error('Ошибка при подтверждении бронирования:', err);
      toast.error(err.response?.data?.message || 'Ошибка при подтверждении бронирования');
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await bookingService.cancelBooking(id);
      toast.success('Бронирование отменено');
      fetchBookings();
    } catch (err) {
      console.error('Ошибка при отмене бронирования:', err);
      toast.error(err.response?.data?.message || 'Ошибка при отмене бронирования');
    }
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '-';
      }
      return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Ошибка при форматировании даты:', error);
      return '-';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Управление бронированиями</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex space-x-4 overflow-x-auto pb-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Все
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Ожидающие
          </button>
          <button 
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'confirmed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Подтвержденные
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'active' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Активные
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Завершенные
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded whitespace-nowrap ${filter === 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Отмененные
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : bookings.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тариф</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Начало</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Окончание</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Стоимость</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map(booking => (
                <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                {booking.carId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {booking.rentalPlanId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.startDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatDate(booking.endDate)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.totalCost} ₽</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      booking.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'}`}
                    >
                      {booking.status === 'completed' ? 'Завершено' : 
                       booking.status === 'active' ? 'Активно' : 
                       booking.status === 'pending' ? 'Ожидает' :
                       booking.status === 'confirmed' ? 'Подтверждено' :
                       'Отменено'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <Link
                        to={`/bookings/${booking.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Детали"
                      >
                        <Icon icon="lucide:eye" className="w-5 h-5" />
                      </Link>
                      
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmBooking(booking.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Подтвердить"
                          >
                            <Icon icon="lucide:check-circle" className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Отменить"
                          >
                            <Icon icon="lucide:x-circle" className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Отменить"
                        >
                          <Icon icon="lucide:x-circle" className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Нет бронирований для отображения</p>
        </div>
      )}
    </div>
  );
};

export default BookingManagementPage;