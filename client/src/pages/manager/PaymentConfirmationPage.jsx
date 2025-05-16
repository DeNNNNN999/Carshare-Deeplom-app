import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { paymentService, bookingService } from '../../api/services';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const PaymentConfirmationPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      console.log(`Запрашиваем платежи со статусом: ${filter}`);
      // Получение всех платежей с добавлением времени для исключения кеширования
      const response = await paymentService.getAllPayments({ 
        status: filter,
        t: Date.now()
      });
      console.log('Получено данных:', response.data);
      setPayments(response.data.payments || []);
    } catch (err) {
      console.error('Ошибка при загрузке платежей:', err);
      setError('Не удалось загрузить платежи. Пожалуйста, попробуйте позже.');
      toast.error('Не удалось загрузить платежи');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId, bookingId) => {
    try {
      // Обновление статуса платежа
      await paymentService.updatePaymentStatus(paymentId, 'completed');
      
      // Подтверждение бронирования
      await bookingService.confirmBooking(bookingId);
      
      toast.success('Платеж подтвержден успешно');
      
      // Обновление списка платежей
      fetchPayments();
    } catch (err) {
      console.error('Ошибка при подтверждении платежа:', err);
      toast.error(err.response?.data?.message || 'Ошибка при подтверждении платежа');
    }
  };

  const handleCancelPayment = async (paymentId, bookingId) => {
    try {
      // Обновление статуса платежа
      await paymentService.updatePaymentStatus(paymentId, 'cancelled');
      
      // Отмена бронирования
      await bookingService.cancelBooking(bookingId);
      
      toast.success('Платеж отменен');
      
      // Обновление списка платежей
      fetchPayments();
    } catch (err) {
      console.error('Ошибка при отмене платежа:', err);
      toast.error(err.response?.data?.message || 'Ошибка при отмене платежа');
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
      <h1 className="text-3xl font-bold mb-6">Подтверждение платежей</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex space-x-4">
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Ожидающие
          </button>
          <button 
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Подтвержденные
          </button>
          <button 
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
          >
            Отмененные
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : payments.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Пользователь</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бронирование</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сумма</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.bookingId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.amount} ₽</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.paymentDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}`}
                    >
                      {payment.status === 'completed' ? 'Подтвержден' : 
                       payment.status === 'pending' ? 'Ожидает' : 'Отменен'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleConfirmPayment(payment.id, payment.bookingId)}
                          className="text-green-600 hover:text-green-900"
                          title="Подтвердить"
                        >
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleCancelPayment(payment.id, payment.bookingId)}
                          className="text-red-600 hover:text-red-900"
                          title="Отменить"
                        >
                          <FiXCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Нет платежей для отображения</p>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmationPage;