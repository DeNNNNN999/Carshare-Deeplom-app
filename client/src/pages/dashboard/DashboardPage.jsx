import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { bookingService, carService } from '../../api/services';
import { Icon } from '@iconify/react';
import moment from 'moment';
import anime from 'animejs';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [activeBookings, setActiveBookings] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendedCars, setRecommendedCars] = useState([]);

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка активных бронирований
        const activeBookingsResponse = await bookingService.getUserBookings({
          status: ['pending', 'confirmed', 'active']
        });
        setActiveBookings(activeBookingsResponse.data.bookings || []);

        // Загрузка недавних бронирований
        const recentBookingsResponse = await bookingService.getUserBookings({
          status: ['completed'],
          limit: 3
        });
        setRecentBookings(recentBookingsResponse.data.bookings || []);

        // Загрузка рекомендуемых автомобилей
        const recommendedCarsResponse = await carService.getCars({
          limit: 3
        });
        setRecommendedCars(recommendedCarsResponse.data.cars || []);
      } catch (error) {
        console.error('Ошибка при загрузке данных для дашборда:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Анимация элементов при монтировании
  useEffect(() => {
    anime({
      targets: '.dashboard-card',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 500
    });
  }, [loading]);

  // Форматирование даты
  const formatDate = (date) => {
    return moment(date).format('DD.MM.YYYY, HH:mm');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Приветствие */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Здравствуйте, {currentUser?.firstName}!
        </h1>
        <p className="text-gray-600">
          Добро пожаловать в личный кабинет CarShare. Здесь вы можете управлять своими бронированиями и платежами.
        </p>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка */}
        <div className="lg:col-span-2 space-y-6">
          {/* Активные бронирования */}
          <div className="card dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Активные бронирования</h2>
              <Link to="/bookings" className="text-primary-600 hover:text-primary-800 text-sm">
                Все бронирования
              </Link>
            </div>

            {activeBookings.length > 0 ? (
              <div className="space-y-4">
                {activeBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {booking.Car.brand} {booking.Car.model}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Icon icon="mdi:calendar" className="mr-2" />
                          <span>
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Icon icon="mdi:clock-outline" className="mr-2" />
                          <span>
                            Статус: <span className="font-medium">{booking.status === 'pending' ? 'Ожидание' : booking.status === 'confirmed' ? 'Подтверждено' : 'Активно'}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      to={`/bookings/${booking.id}`}
                      className="btn btn-outline py-1 px-3 text-sm"
                    >
                      Детали
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Icon icon="mdi:car" className="mx-auto text-4xl mb-2" />
                <p>У вас нет активных бронирований.</p>
                <Link to="/search" className="btn btn-primary mt-4">
                  Забронировать автомобиль
                </Link>
              </div>
            )}
          </div>

          {/* Недавние бронирования */}
          <div className="card dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Недавние поездки</h2>
            </div>

            {recentBookings.length > 0 ? (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border border-gray-200 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {booking.Car.brand} {booking.Car.model}
                      </h3>
                      <div className="text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Icon icon="mdi:calendar" className="mr-2" />
                          <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <Icon icon="mdi:star" className="mr-2 text-yellow-500" />
                          <span>
                            {booking.Review ? (
                              <span>Вы оставили отзыв с оценкой {booking.Review.rating}/5</span>
                            ) : (
                              <Link to={`/reviews/create?bookingId=${booking.id}`} className="text-primary-600 hover:text-primary-800">
                                Оставить отзыв
                              </Link>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-700 font-medium">
                      {booking.totalCost} ₽
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Icon icon="mdi:clock-outline" className="mx-auto text-4xl mb-2" />
                <p>У вас пока нет завершенных поездок.</p>
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка */}
        <div className="space-y-6">
          {/* Информация о профиле */}
          <div className="card dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ваш профиль</h2>
              <Link to="/profile" className="text-primary-600 hover:text-primary-800 text-sm">
                Редактировать
              </Link>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary-100 w-10 h-10 rounded-full flex items-center justify-center">
                  <Icon icon="mdi:account" className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{currentUser?.email}</p>
                </div>
              </div>

              <div className="py-2 border-t border-b border-gray-200 my-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Статус профиля:</span>
                  <span className="text-sm font-medium text-green-600">Активен</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Верификация:</span>
                  <span className="text-sm font-medium">
                    {currentUser?.isVerified ? (
                      <span className="text-green-600">Подтвержден</span>
                    ) : (
                      <span className="text-yellow-600">Требуется подтверждение</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Link to="/profile/documents" className="btn btn-outline w-full text-sm py-2">
                  Загрузить документы
                </Link>
              </div>
            </div>
          </div>

          {/* Рекомендуемые автомобили */}
          <div className="card dashboard-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Рекомендуем попробовать</h2>
            </div>

            <div className="space-y-4">
              {recommendedCars.map((car) => (
                <div
                  key={car.id}
                  className="flex gap-3 border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={car.imageUrl || 'https://via.placeholder.com/80?text=Car'}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {car.brand} {car.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {car.transmission}, {car.year} г.
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm font-medium text-green-600">
                        от {car.hourlyRate} ₽/час
                      </span>
                      <Link
                        to={`/cars/${car.id}`}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Подробнее
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Link to="/search" className="btn btn-primary w-full">
                Найти автомобиль
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
