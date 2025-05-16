import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService, paymentService, reviewService } from '../../api/services';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin, FiTruck, FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import moment from 'moment';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payments, setPayments] = useState([]);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        // Получение информации о бронировании
        const bookingResponse = await bookingService.getBookingById(id);
        setBooking(bookingResponse.data);
        
        // Получение информации о платежах
        if (bookingResponse.data) {
          const paymentsResponse = await paymentService.getUserPayments();
          const bookingPayments = paymentsResponse.data.payments.filter(
            p => p.bookingId === parseInt(id)
          );
          setPayments(bookingPayments);
          
          // Проверка наличия отзыва
          try {
            const reviewResponse = await reviewService.getUserReviews();
            const bookingReview = reviewResponse.data.reviews.find(
              r => r.bookingId === parseInt(id)
            );
            if (bookingReview) {
              setReview(bookingReview);
            }
          } catch (reviewErr) {
            console.error("Error fetching reviews:", reviewErr);
          }
        }
      } catch (err) {
        setError('Не удалось загрузить информацию о бронировании');
        console.error('Error fetching booking details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Вы уверены, что хотите отменить бронирование? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      await bookingService.cancelBooking(id);
      // Обновляем информацию о бронировании
      const bookingResponse = await bookingService.getBookingById(id);
      setBooking(bookingResponse.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось отменить бронирование');
    }
  };

  const handleCompleteBookingEarly = async () => {
    if (!window.confirm('Вы уверены, что хотите досрочно завершить аренду? Это действие нельзя отменить.')) {
      return;
    }
    
    try {
      // Здесь можно запросить у пользователя финальный пробег, но для простоты оставим null
      await bookingService.completeBookingEarly(id, null);
      // Обновляем информацию о бронировании
      const bookingResponse = await bookingService.getBookingById(id);
      setBooking(bookingResponse.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось завершить аренду');
    }
  };

  // Форма для отзыва
  const reviewFormik = useFormik({
    initialValues: {
      rating: 5,
      comment: ''
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, 'Минимальная оценка - 1')
        .max(5, 'Максимальная оценка - 5')
        .required('Оценка обязательна'),
      comment: Yup.string()
        .min(3, 'Минимальная длина - 3 символа')
        .required('Комментарий обязателен')
    }),
    onSubmit: async (values) => {
      try {
        await reviewService.createReview({
          bookingId: parseInt(id),
          carId: booking.carId,
          rating: values.rating,
          comment: values.comment
        });
        
        // Получаем обновленный отзыв
        const reviewResponse = await reviewService.getUserReviews();
        const bookingReview = reviewResponse.data.reviews.find(
          r => r.bookingId === parseInt(id)
        );
        if (bookingReview) {
          setReview(bookingReview);
        }
        
        setShowReviewForm(false);
      } catch (err) {
        alert(err.response?.data?.message || 'Не удалось отправить отзыв');
      }
    }
  });

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

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <div className="text-center mt-4">
          <Link to="/bookings" className="btn btn-primary">
            Вернуться к бронированиям
          </Link>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <p className="mb-4">Бронирование не найдено</p>
          <Link to="/bookings" className="btn btn-primary">
            Вернуться к бронированиям
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/bookings" className="text-primary-600 hover:text-primary-800">
          &larr; Вернуться к бронированиям
        </Link>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Бронирование #{booking.id}
              </h1>
              <div className="flex items-center">
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(booking.status)}`}
                >
                  {getStatusLabel(booking.status)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="text-gray-600">Дата создания:</div>
              <div>{moment(booking.createdAt).format('DD.MM.YYYY HH:mm')}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Детали аренды</h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <FiCalendar className="text-gray-500 mr-2" />
                  <div>
                    <div className="text-sm text-gray-600">Период аренды</div>
                    <div>{moment(booking.startDate).format('DD.MM.YYYY HH:mm')} — {moment(booking.endDate).format('DD.MM.YYYY HH:mm')}</div>
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
                    <div className="text-sm text-gray-600">Общая стоимость</div>
                    <div className="font-medium">{Number(booking.totalCost).toFixed(2)} ₽</div>
                  </div>
                </div>
                
                {booking.initialMileage && (
                  <div className="flex items-center">
                    <FiTruck className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Начальный пробег</div>
                      <div>{booking.initialMileage} км</div>
                    </div>
                  </div>
                )}
                
                {booking.finalMileage && (
                  <div className="flex items-center">
                    <FiTruck className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Конечный пробег</div>
                      <div>{booking.finalMileage} км</div>
                    </div>
                  </div>
                )}
                
                {booking.rentalPlan && (
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Тарифный план</div>
                    <div className="font-medium">{booking.rentalPlan.name}</div>
                    <div className="text-sm text-gray-600 mt-1">{booking.rentalPlan.description}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-3">Информация об автомобиле</h2>
              
              {booking.car ? (
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-lg">
                      <Link to={`/cars/${booking.car.id}`} className="text-primary-600 hover:text-primary-800">
                        {booking.car.brand} {booking.car.model} ({booking.car.year})
                      </Link>
                    </div>
                    <div className="text-gray-600">
                      {booking.car.color}, {booking.car.transmission}, {booking.car.fuelType}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600">Регистрационный номер</div>
                    <div>{booking.car.registrationNumber}</div>
                  </div>
                  
                  <div className="flex items-center">
                    <FiMapPin className="text-gray-500 mr-2" />
                    <div>
                      <div className="text-sm text-gray-600">Место получения/возврата</div>
                      <div>{booking.car.location || 'Не указано'}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-600">Информация об автомобиле недоступна</div>
              )}
            </div>
          </div>
          
          {payments.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Платежи</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Дата</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Сумма</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Статус</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Способ оплаты</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-4 py-2">{payment.id}</td>
                          <td className="px-4 py-2">{moment(payment.paymentDate).format('DD.MM.YYYY HH:mm')}</td>
                          <td className="px-4 py-2 font-medium">{Number(payment.amount).toFixed(2)} ₽</td>
                          <td className="px-4 py-2">
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
                          </td>
                          <td className="px-4 py-2">{payment.paymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Отзыв */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Отзыв</h2>
            
            {review ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <div className="flex mr-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600">{moment(review.createdAt).format('DD.MM.YYYY')}</span>
                </div>
                <p className="text-gray-800">{review.comment}</p>
              </div>
            ) : booking.status === 'completed' ? (
              showReviewForm ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <form onSubmit={reviewFormik.handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Оценка
                      </label>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => reviewFormik.setFieldValue('rating', i + 1)}
                            className="mr-1 focus:outline-none"
                          >
                            <svg 
                              className={`w-6 h-6 ${i < reviewFormik.values.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                      {reviewFormik.touched.rating && reviewFormik.errors.rating ? (
                        <div className="text-red-500 text-sm mt-1">{reviewFormik.errors.rating}</div>
                      ) : null}
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Комментарий
                      </label>
                      <textarea
                        id="comment"
                        name="comment"
                        rows="4"
                        className="input w-full"
                        placeholder="Поделитесь вашими впечатлениями об аренде"
                        {...reviewFormik.getFieldProps('comment')}
                      ></textarea>
                      {reviewFormik.touched.comment && reviewFormik.errors.comment ? (
                        <div className="text-red-500 text-sm mt-1">{reviewFormik.errors.comment}</div>
                      ) : null}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(false)}
                        className="btn btn-outline"
                      >
                        Отмена
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={reviewFormik.isSubmitting}
                      >
                        {reviewFormik.isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="mb-3">Вы еще не оставили отзыв об этой аренде</p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn btn-primary"
                  >
                    Оставить отзыв
                  </button>
                </div>
              )
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
                Вы сможете оставить отзыв после завершения аренды
              </div>
            )}
          </div>
          
          {/* Кнопки действий */}
          <div className="border-t pt-4 flex flex-wrap justify-end space-x-2">
            {/* Кнопка просмотра автомобиля */}
            {booking.car && (
              <Link 
                to={`/cars/${booking.car.id}`}
                className="btn btn-outline"
              >
                Просмотреть автомобиль
              </Link>
            )}
            
            {/* Кнопка отмены бронирования (только для статусов pending и confirmed) */}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button 
                onClick={handleCancelBooking}
                className="btn btn-danger"
              >
                Отменить бронирование
              </button>
            )}
            
            {/* Кнопка продления (только для активных бронирований) */}
            {booking.status === 'active' && (
              <Link 
                to={`/bookings/${booking.id}/extend`}
                className="btn btn-primary"
              >
                Продлить аренду
              </Link>
            )}
            
            {/* Кнопка досрочного завершения (только для активных бронирований) */}
            {booking.status === 'active' && (
              <button 
                onClick={handleCompleteBookingEarly}
                className="btn btn-warning"
              >
                Завершить досрочно
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
