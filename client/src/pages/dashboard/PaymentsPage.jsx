import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentService, bookingService } from '../../api/services';
import { FiCreditCard, FiCalendar, FiDollarSign, FiFilter, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import moment from 'moment';

const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalPayments: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    fetchPayments();
    fetchPendingBookings();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const response = await paymentService.getUserPayments();
      
      let filteredPayments = response.data.payments || [];
      
      // Применение фильтров
      if (filters.status) {
        filteredPayments = filteredPayments.filter(p => p.status === filters.status);
      }
      
      if (filters.dateFrom) {
        const fromDate = moment(filters.dateFrom).startOf('day');
        filteredPayments = filteredPayments.filter(p => 
          moment(p.paymentDate).isAfter(fromDate)
        );
      }
      
      if (filters.dateTo) {
        const toDate = moment(filters.dateTo).endOf('day');
        filteredPayments = filteredPayments.filter(p => 
          moment(p.paymentDate).isBefore(toDate)
        );
      }
      
      setPayments(filteredPayments);
      
      // Расчет статистики
      const totalAmount = filteredPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);
      
      setStats({
        totalPayments: filteredPayments.length,
        totalAmount,
      });
    } catch (err) {
      setError('Не удалось загрузить платежи. Пожалуйста, попробуйте позже.');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  // Получение бронирований, которые ждут оплаты (статус 'pending' или 'confirmed')
  const fetchPendingBookings = async () => {
    try {
      const response = await bookingService.getUserBookings({
        status: ['pending', 'confirmed']
      });
      
      // Проверяем, есть ли уже платеж для каждого бронирования
      const bookingsWithoutPayments = response.data.bookings.filter(booking => {
        // Проверяем, есть ли платеж с таким bookingId
        const existingPayment = payments.find(payment => payment.bookingId === booking.id);
        return !existingPayment;
      });
      
      setPendingBookings(bookingsWithoutPayments);
    } catch (err) {
      console.error('Error fetching pending bookings:', err);
    }
  };

  // Отметка платежа как "Оплачено"
  const handleMarkAsPaid = async (bookingId, amount) => {
    try {
      // Создаем платеж
      const response = await paymentService.createPayment({
        bookingId,
        paymentMethod: 'cash', // или другой метод
        amount
      });
      
      // Уведомляем пользователя
      toast.success('Платеж отмечен как оплаченный и ожидает подтверждения');
      
      // Обновляем списки
      fetchPayments();
      fetchPendingBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка при создании платежа');
      console.error('Error marking booking as paid:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      dateFrom: '',
      dateTo: '',
    });
    setTimeout(() => {
      fetchPayments();
    }, 0);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'В обработке';
      case 'completed': return 'Оплачено';
      case 'failed': return 'Ошибка';
      case 'refunded': return 'Возврат';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Мои платежи</h1>
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
                  <option value="pending">В обработке</option>
                  <option value="completed">Оплачено</option>
                  <option value="failed">Ошибка</option>
                  <option value="refunded">Возврат</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата (от)
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
                  Дата (до)
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
      
      {/* Статистика платежей */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-full mr-4">
              <FiCreditCard className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-gray-600">Всего платежей</p>
              <p className="text-xl font-semibold">{stats.totalPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <FiDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600">Общая сумма оплат</p>
              <p className="text-xl font-semibold">{stats.totalAmount.toFixed(2)} ₽</p>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Неоплаченные бронирования */}
      {pendingBookings.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Ожидают оплаты</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Период аренды</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автомобиль</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {moment(booking.startDate).format('DD.MM.YYYY')} — {moment(booking.endDate).format('DD.MM.YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {booking.car ? (
                          <span>{booking.car.brand} {booking.car.model}</span>
                        ) : (
                          <span className="text-gray-500">Не указан</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {Number(booking.totalCost).toFixed(2)} ₽
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {
                            booking.status === 'pending' ? 'Ожидает подтверждения' : 
                            booking.status === 'confirmed' ? 'Подтверждено' : 
                            booking.status
                          }
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          <Link 
                            to={`/bookings/${booking.id}`}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            Подробнее
                          </Link>
                          <button 
                            onClick={() => handleMarkAsPaid(booking.id, booking.totalCost)}
                            className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <FiCheck className="mr-1" />
                            Оплачено
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* История платежей */}
      <h2 className="text-xl font-bold mb-4">История платежей</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Способ оплаты</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бронирование</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {moment(payment.paymentDate).format('DD.MM.YYYY HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {Number(payment.amount).toFixed(2)} ₽
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${getStatusClass(payment.status)}`}
                      >
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.paymentMethod || 'Банковская карта'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.bookingId ? (
                        <Link 
                          to={`/bookings/${payment.bookingId}`} 
                          className="text-primary-600 hover:text-primary-800"
                        >
                          #{payment.bookingId}
                        </Link>
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <div className="text-gray-500 mb-4">У вас пока нет платежей</div>
          <Link to="/search" className="btn btn-primary">
            Найти автомобиль
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
