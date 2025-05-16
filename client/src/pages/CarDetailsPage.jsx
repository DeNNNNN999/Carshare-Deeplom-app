import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { carService, reviewService, rentalPlanService } from '../api/services';
import { FiClock, FiCalendar, FiDollarSign, FiStar, FiUser, FiMapPin, FiCheck, FiChevronLeft } from 'react-icons/fi';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import anime from 'animejs';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  // Состояния
  const [car, setCar] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rentalPlans, setRentalPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  
  // Загрузка данных об автомобиле
  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Загрузка информации об автомобиле
        const carResponse = await carService.getCarById(id);
        setCar(carResponse.data.car);
        
        // Загрузка отзывов
        const reviewsResponse = await reviewService.getCarReviews(id);
        setReviews(reviewsResponse.data.reviews || []);
        
        // Загрузка тарифных планов
        const plansResponse = await rentalPlanService.getRentalPlans();
        setRentalPlans(plansResponse.data.rentalPlans || []);
        
        // Устанавливаем первый план по умолчанию
        if (plansResponse.data.rentalPlans && plansResponse.data.rentalPlans.length > 0) {
          setSelectedPlan(plansResponse.data.rentalPlans[0]);
        }
      } catch (err) {
        console.error('Ошибка при загрузке информации об автомобиле:', err);
        setError('Не удалось загрузить информацию об автомобиле. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCarDetails();
  }, [id]);
  
  // Анимация при загрузке
  useEffect(() => {
    if (!loading && car) {
      anime({
        targets: '.car-animation',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 500
      });
    }
  }, [loading, car]);
  
  // Форматирование даты
  const formatDate = (date) => {
    return moment(date).format('DD.MM.YYYY');
  };
  
  // Валидация формы бронирования
  const bookingFormik = useFormik({
    initialValues: {
      startDate: null,
      endDate: null,
      promoCode: ''
    },
    validationSchema: Yup.object({
      startDate: Yup.date()
        .required('Дата начала обязательна')
        .min(new Date(), 'Дата начала не может быть в прошлом'),
      endDate: Yup.date()
        .required('Дата окончания обязательна')
        .min(
          Yup.ref('startDate'),
          'Дата окончания должна быть позже даты начала'
        )
    }),
    onSubmit: (values) => {
      if (!currentUser) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        navigate('/login', { 
          state: { 
            from: `/cars/${id}`,
            booking: { 
              carId: id, 
              rentalPlanId: selectedPlan?.id,
              startDate: values.startDate,
              endDate: values.endDate,
              promoCode: values.promoCode
            }
          } 
        });
        return;
      }
      
      // Если пользователь авторизован, перенаправляем на страницу оформления бронирования
      navigate('/booking/new', {
        state: {
          carId: id,
          rentalPlanId: selectedPlan?.id,
          startDate: values.startDate,
          endDate: values.endDate,
          promoCode: values.promoCode,
          totalCost
        }
      });
    }
  });
  
  // Расчет общей стоимости аренды
  useEffect(() => {
    const calculateCost = () => {
      if (!car || !selectedPlan || !bookingFormik.values.startDate || !bookingFormik.values.endDate) {
        setTotalCost(0);
        return;
      }
      
      const start = new Date(bookingFormik.values.startDate);
      const end = new Date(bookingFormik.values.endDate);
      const durationMs = end - start;
      
      let durationUnits;
      let ratePerUnit;
      
      // Определяем тип длительности и ставку на основе типа тарифного плана
      switch (selectedPlan.durationType) {
        case 'minute':
          durationUnits = durationMs / (1000 * 60);
          ratePerUnit = car.minuteRate || 0;
          break;
        case 'hour':
          durationUnits = durationMs / (1000 * 60 * 60);
          ratePerUnit = car.hourlyRate || 0;
          break;
        case 'day':
          durationUnits = durationMs / (1000 * 60 * 60 * 24);
          ratePerUnit = car.dailyRate || 0;
          break;
        case 'week':
          durationUnits = durationMs / (1000 * 60 * 60 * 24 * 7);
          ratePerUnit = car.dailyRate ? car.dailyRate * 7 : 0;
          break;
        case 'month':
          // Приблизительно месяц как 30 дней
          durationUnits = durationMs / (1000 * 60 * 60 * 24 * 30);
          ratePerUnit = car.dailyRate ? car.dailyRate * 30 : 0;
          break;
        default:
          durationUnits = 0;
          ratePerUnit = 0;
      }
      
      // Округляем количество единиц времени до десятых
      durationUnits = Math.ceil(durationUnits * 10) / 10;
      
      // Базовая стоимость из тарифного плана + стоимость за единицы времени
      let cost = parseFloat(selectedPlan.basePrice || 0) + (durationUnits * parseFloat(ratePerUnit));
      
      // Применяем скидку тарифного плана, если она есть
      if (selectedPlan.discountPercent > 0) {
        const discountAmount = (cost * parseFloat(selectedPlan.discountPercent)) / 100;
        cost -= discountAmount;
      }
      
      // Округляем до целого
      setTotalCost(Math.round(cost));
    };
    
    calculateCost();
  }, [car, selectedPlan, bookingFormik.values.startDate, bookingFormik.values.endDate]);
  
  // Обработчик изменения тарифного плана
  const handlePlanChange = (plan) => {
    setSelectedPlan(plan);
    
    // Анимация выбранного плана
    anime({
      targets: `.tariff-card-${plan.id}`,
      scale: [1, 1.02, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };
  
  // Обработчик изменения изображения
  const handleImageChange = (index) => {
    setActiveImageIndex(index);
    
    // Анимация смены изображения
    anime({
      targets: '.car-main-image',
      opacity: [0.8, 1],
      scale: [0.98, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (error || !car) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Автомобиль не найден'}
        </div>
        <Link to="/search" className="btn btn-primary">
          <FiChevronLeft className="mr-2" />
          Вернуться к поиску
        </Link>
      </div>
    );
  }
  
  // Для примера используем массив изображений
  const carImages = [
    car.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image',
    'https://via.placeholder.com/600x400?text=Image+2',
    'https://via.placeholder.com/600x400?text=Image+3',
    'https://via.placeholder.com/600x400?text=Image+4'
  ];
  
  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        {/* Навигация назад */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center text-primary-600 hover:text-primary-800">
            <FiChevronLeft className="mr-1" />
            Назад к результатам поиска
          </Link>
        </div>
        
        {/* Верхний блок с информацией об автомобиле */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 car-animation">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Галерея изображений */}
            <div>
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src={carImages[activeImageIndex]} 
                  alt={`${car.brand} ${car.model}`}
                  className="car-main-image w-full h-64 object-cover"
                />
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {carImages.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-16 rounded-md overflow-hidden cursor-pointer transition-opacity ${
                      activeImageIndex === index ? 'ring-2 ring-primary-500' : 'opacity-80 hover:opacity-100'
                    }`}
                    onClick={() => handleImageChange(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Информация об автомобиле */}
            <div>
              {/* Заголовок и рейтинг */}
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold">
                  {car.brand} {car.model}
                </h1>
                <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                  <FiStar className="text-yellow-500 mr-1" />
                  <span className="font-medium">{car.averageRating?.toFixed(1) || 'Нет оценок'}</span>
                </div>
              </div>
              
              {/* Основные характеристики */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <FiCalendar className="text-primary-500 mr-2" />
                  <span>Год выпуска: <strong>{car.year}</strong></span>
                </div>
                <div className="flex items-center">
                  <FiClock className="text-primary-500 mr-2" />
                  <span>КПП: <strong>{car.transmission}</strong></span>
                </div>
                <div className="flex items-center">
                  <svg className="text-primary-500 mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Топливо: <strong>{car.fuelType}</strong></span>
                </div>
                <div className="flex items-center">
                  <svg className="text-primary-500 mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Мест: <strong>{car.seats}</strong></span>
                </div>
              </div>
              
              {/* Расположение */}
              {car.latitude && car.longitude && (
                <div className="flex items-start mb-6">
                  <FiMapPin className="text-primary-500 mr-2 mt-1" />
                  <div>
                    <div className="font-medium">Текущее расположение</div>
                    <div className="text-sm text-gray-600">
                      Примерно: Москва, улица Тверская, 15
                    </div>
                  </div>
                </div>
              )}
              
              {/* Цены */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-2">Тарифы</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-600">Минутный</div>
                    <div className="font-bold">{car.minuteRate} ₽</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Часовой</div>
                    <div className="font-bold">{car.hourlyRate} ₽</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Дневной</div>
                    <div className="font-bold">{car.dailyRate} ₽</div>
                  </div>
                </div>
              </div>
              
              {/* Статус */}
              <div className="flex items-center">
                <div 
                  className={`w-3 h-3 rounded-full mr-2 ${
                    car.status === 'available' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
                <span>
                  {car.status === 'available' ? 'Доступен для аренды' : 'Недоступен'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Форма бронирования и выбор тарифа */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Выбор тарифа */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 car-animation">Выберите тарифный план</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 car-animation">
              {rentalPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`tariff-card-${plan.id} bg-white rounded-lg shadow-md p-5 cursor-pointer transition-all ${
                    selectedPlan?.id === plan.id 
                      ? 'ring-2 ring-primary-500' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => handlePlanChange(plan)}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold">{plan.name}</h3>
                    {selectedPlan?.id === plan.id && (
                      <div className="bg-primary-100 p-1 rounded-full">
                        <FiCheck className="text-primary-600" />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{plan.description}</p>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Базовая цена:</span>
                    <span className="font-medium">{plan.basePrice} ₽</span>
                  </div>
                  
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Тариф:</span>
                    <span className="font-medium">
                      {plan.durationType === 'minute' && `${car.minuteRate} ₽/мин`}
                      {plan.durationType === 'hour' && `${car.hourlyRate} ₽/час`}
                      {plan.durationType === 'day' && `${car.dailyRate} ₽/день`}
                      {plan.durationType === 'week' && `${car.dailyRate * 7} ₽/неделя`}
                      {plan.durationType === 'month' && `${car.dailyRate * 30} ₽/месяц`}
                    </span>
                  </div>
                  
                  {plan.discountPercent > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Скидка:</span>
                      <span className="font-medium">{plan.discountPercent}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Форма бронирования */}
          <div className="car-animation">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Забронировать автомобиль</h2>
              
              <form onSubmit={bookingFormik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="startDate" className="label">
                    Дата и время начала
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="startDate"
                      selected={bookingFormik.values.startDate}
                      onChange={(date) => bookingFormik.setFieldValue('startDate', date)}
                      selectsStart
                      startDate={bookingFormik.values.startDate}
                      endDate={bookingFormik.values.endDate}
                      minDate={new Date()}
                      showTimeSelect
                      dateFormat="dd.MM.yyyy HH:mm"
                      placeholderText="Выберите дату и время"
                      className={`input w-full ${
                        bookingFormik.touched.startDate && bookingFormik.errors.startDate 
                          ? 'border-red-500' 
                          : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-500" />
                    </div>
                  </div>
                  {bookingFormik.touched.startDate && bookingFormik.errors.startDate ? (
                    <div className="error-message">{bookingFormik.errors.startDate}</div>
                  ) : null}
                </div>
                
                <div className="form-group">
                  <label htmlFor="endDate" className="label">
                    Дата и время окончания
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="endDate"
                      selected={bookingFormik.values.endDate}
                      onChange={(date) => bookingFormik.setFieldValue('endDate', date)}
                      selectsEnd
                      startDate={bookingFormik.values.startDate}
                      endDate={bookingFormik.values.endDate}
                      minDate={bookingFormik.values.startDate || new Date()}
                      showTimeSelect
                      dateFormat="dd.MM.yyyy HH:mm"
                      placeholderText="Выберите дату и время"
                      className={`input w-full ${
                        bookingFormik.touched.endDate && bookingFormik.errors.endDate 
                          ? 'border-red-500' 
                          : ''
                      }`}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCalendar className="text-gray-500" />
                    </div>
                  </div>
                  {bookingFormik.touched.endDate && bookingFormik.errors.endDate ? (
                    <div className="error-message">{bookingFormik.errors.endDate}</div>
                  ) : null}
                </div>
                
                <div className="form-group">
                  <label htmlFor="promoCode" className="label">
                    Промокод (если есть)
                  </label>
                  <input
                    type="text"
                    id="promoCode"
                    name="promoCode"
                    placeholder="Введите промокод"
                    className="input w-full"
                    {...bookingFormik.getFieldProps('promoCode')}
                  />
                </div>
                
                {/* Расчет стоимости */}
                <div className="py-4 border-t border-b border-gray-200 my-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Тарифный план:</span>
                    <span className="font-medium">{selectedPlan?.name || 'Не выбран'}</span>
                  </div>
                  {bookingFormik.values.startDate && bookingFormik.values.endDate && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Период аренды:</span>
                      <span className="font-medium">
                        {formatDate(bookingFormik.values.startDate)} - {formatDate(bookingFormik.values.endDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between mt-2 text-lg">
                    <span className="font-bold">Итого:</span>
                    <span className="font-bold text-primary-600">{totalCost} ₽</span>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={car.status !== 'available'}
                >
                  {car.status === 'available' ? 'Забронировать' : 'Недоступен'}
                </button>
                
                {!currentUser && (
                  <div className="mt-2 text-sm text-gray-600 text-center">
                    Для бронирования необходимо <Link to="/login" className="text-primary-600 hover:text-primary-800">войти в систему</Link>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
        
        {/* Отзывы */}
        <div className="car-animation">
          <h2 className="text-2xl font-bold mb-6">Отзывы об автомобиле</h2>
          
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                        <FiUser className="text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {review.User.firstName} {review.User.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
                      <FiStar className="text-yellow-500 mr-1" />
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-bold mb-2">У этого автомобиля еще нет отзывов</h3>
              <p className="text-gray-600">
                Будьте первым, кто оставит отзыв об этом автомобиле после аренды.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
