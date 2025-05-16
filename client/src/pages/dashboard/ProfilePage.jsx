import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, paymentService } from '../../api/services';
import { Icon } from '@iconify/react';
import moment from 'moment';

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Загрузка последних бронирований пользователя
        const bookingsResponse = await bookingService.getUserBookings({ limit: 5 });
        setBookings(bookingsResponse.data.bookings || []);
        
        // Загрузка последних платежей пользователя
        const paymentsResponse = await paymentService.getUserPayments();
        setPayments(paymentsResponse.data.payments || []);
        
        // Расчет статистики
        const totalBookings = bookingsResponse.data.total || 0;
        const activeBookings = (bookingsResponse.data.bookings || []).filter(
          b => b.status === 'active' || b.status === 'confirmed'
        ).length;
        
        const totalSpent = (paymentsResponse.data.payments || [])
          .filter(p => p.status === 'completed')
          .reduce((sum, p) => sum + Number(p.amount), 0);
        
        setStats({
          totalBookings,
          activeBookings,
          totalSpent
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      <h1 className="text-2xl font-bold mb-6">Мой профиль</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow rounded-lg p-6 col-span-2">
          <h2 className="text-xl font-semibold mb-4">Личная информация</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Имя:</p>
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Телефон:</p>
              <p className="font-medium">{user?.phone || 'Не указан'}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Дата рождения:</p>
              <p className="font-medium">
                {user?.birthDate 
                  ? moment(user.birthDate).format('DD.MM.YYYY') 
                  : 'Не указана'}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">Номер водительского удостоверения:</p>
              <p className="font-medium">{user?.licenseNumber || 'Не указан'}</p>
            </div>
            
            <div>
              <p className="text-gray-600">Срок действия ВУ:</p>
              <p className="font-medium">
                {user?.licenseExpiryDate 
                  ? moment(user.licenseExpiryDate).format('DD.MM.YYYY') 
                  : 'Не указан'}
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Link to="/profile/edit" className="btn btn-primary">
              Редактировать профиль
            </Link>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Статистика</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Icon icon="mdi:truck" className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Всего бронирований</p>
                <p className="text-xl font-semibold">{stats.totalBookings}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Icon icon="mdi:clock-outline" className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Активные бронирования</p>
                <p className="text-xl font-semibold">{stats.activeBookings}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Icon icon="mdi:currency-usd" className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Потрачено всего</p>
                <p className="text-xl font-semibold">{stats.totalSpent.toFixed(2)} ₽</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Последние бронирования</h2>
            <Link to="/bookings" className="text-primary-600 hover:text-primary-800">
              Смотреть все
            </Link>
          </div>
          
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link 
                        to={`/bookings/${booking.id}`}
                        className="font-medium text-lg hover:text-primary-600"
                      >
                        {booking.car?.brand} {booking.car?.model}
                      </Link>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Icon icon="mdi:calendar" className="mr-1" />
                        {moment(booking.startDate).format('DD.MM.YYYY')} — {moment(booking.endDate).format('DD.MM.YYYY')}
                      </div>
                    </div>
                    <div>
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'active' ? 'bg-green-100 text-green-800' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status === 'active' ? 'Активно' :
                         booking.status === 'completed' ? 'Завершено' :
                         booking.status === 'pending' ? 'Ожидает' :
                         booking.status === 'cancelled' ? 'Отменено' :
                         booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              У вас пока нет бронирований
            </div>
          )}
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Последние платежи</h2>
            <Link to="/payments" className="text-primary-600 hover:text-primary-800">
              Смотреть все
            </Link>
          </div>
          
          {payments.length > 0 ? (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div key={payment.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        Оплата бронирования #{payment.bookingId}
                      </p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Icon icon="mdi:calendar" className="mr-1" />
                        {moment(payment.paymentDate).format('DD.MM.YYYY HH:mm')}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{Number(payment.amount).toFixed(2)} ₽</p>
                      <span 
                        className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          payment.status === 'refunded' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {payment.status === 'completed' ? 'Оплачено' :
                         payment.status === 'pending' ? 'В обработке' :
                         payment.status === 'failed' ? 'Ошибка' :
                         payment.status === 'refunded' ? 'Возврат' :
                         payment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              У вас пока нет платежей
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
