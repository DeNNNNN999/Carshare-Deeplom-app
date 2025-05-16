import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { carService, rentalPlanService, bookingService } from '../../api/services';
import { Icon } from '@iconify/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CreateBookingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cars, setCars] = useState([]);
  const [rentalPlans, setRentalPlans] = useState([]);
  const [error, setError] = useState('');
  const [totalCost, setTotalCost] = useState(0);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Загрузка списка доступных автомобилей
        const carsResponse = await carService.getCars({ status: 'available' });
        setCars(carsResponse.data.cars || []);

        // Загрузка списка тарифных планов
        const plansResponse = await rentalPlanService.getRentalPlans();
        setRentalPlans(plansResponse.data.rentalPlans || []);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить необходимые данные. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Расчет стоимости аренды
  const calculateTotalCost = (car, plan, startDate, endDate) => {
    if (!car || !plan || !startDate || !endDate) {
      return 0;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 1) diffDays = 1;

    let cost = 0;
    if (plan.durationType === 'day') {
      cost = car.dailyRate * diffDays;
    } else if (plan.durationType === 'hour') {
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      cost = car.hourlyRate * diffHours;
    }

    // Применение скидки
    if (plan.discountPercent) {
      cost = cost * (1 - plan.discountPercent / 100);
    }

    return Math.round(cost);
  };

  // Валидация формы с Formik + Yup
  const formik = useFormik({
    initialValues: {
      carId: '',
      rentalPlanId: '',
      startDate: null,
      endDate: null,
      promoCode: '',
    },
    validationSchema: Yup.object({
      carId: Yup.string()
        .required('Выберите автомобиль'),
      rentalPlanId: Yup.string()
        .required('Выберите тарифный план'),
      startDate: Yup.date()
        .required('Дата начала обязательна')
        .min(new Date(), 'Дата начала не может быть в прошлом'),
      endDate: Yup.date()
        .required('Дата окончания обязательна')
        .min(Yup.ref('startDate'), 'Дата окончания должна быть позже даты начала'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      
      try {
        // Создание бронирования
        const response = await bookingService.createBooking(values);
        
        toast.success('Бронирование успешно создано');
        
        // Перенаправление на страницу бронирования
        navigate(`/bookings/${response.data.booking.id}`);
      } catch (err) {
        console.error('Ошибка при создании бронирования:', err);
        setError(err.response?.data?.message || 'Ошибка при создании бронирования');
      } finally {
        setLoading(false);
      }
    }
  });

  // Обновление стоимости при изменении полей формы
  useEffect(() => {
    const { carId, rentalPlanId, startDate, endDate } = formik.values;
    
    if (carId && rentalPlanId && startDate && endDate) {
      const car = cars.find(car => car.id.toString() === carId.toString());
      const plan = rentalPlans.find(plan => plan.id.toString() === rentalPlanId.toString());
      
      const cost = calculateTotalCost(car, plan, startDate, endDate);
      setTotalCost(cost);
    } else {
      setTotalCost(0);
    }
  }, [formik.values, cars, rentalPlans]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Создание нового бронирования</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Выбор автомобиля */}
              <div className="form-group col-span-2">
                <label htmlFor="carId" className="label flex items-center">
                  <Icon icon="lucide:car" className="mr-2" /> Автомобиль
                </label>
                <select
                  id="carId"
                  name="carId"
                  className={`input w-full ${
                    formik.touched.carId && formik.errors.carId ? 'border-red-500' : ''
                  }`}
                  {...formik.getFieldProps('carId')}
                >
                  <option value="">Выберите автомобиль</option>
                  {cars.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} ({car.year}, {car.transmission})
                    </option>
                  ))}
                </select>
                {formik.touched.carId && formik.errors.carId ? (
                  <div className="text-red-500 mt-1 text-sm">{formik.errors.carId}</div>
                ) : null}
              </div>
              
              {/* Выбор тарифного плана */}
              <div className="form-group col-span-2">
                <label htmlFor="rentalPlanId" className="label flex items-center">
                  <Icon icon="lucide:clipboard" className="mr-2" /> Тарифный план
                </label>
                <select
                  id="rentalPlanId"
                  name="rentalPlanId"
                  className={`input w-full ${
                    formik.touched.rentalPlanId && formik.errors.rentalPlanId ? 'border-red-500' : ''
                  }`}
                  {...formik.getFieldProps('rentalPlanId')}
                >
                  <option value="">Выберите тарифный план</option>
                  {rentalPlans.map(plan => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.description}
                    </option>
                  ))}
                </select>
                {formik.touched.rentalPlanId && formik.errors.rentalPlanId ? (
                  <div className="text-red-500 mt-1 text-sm">{formik.errors.rentalPlanId}</div>
                ) : null}
              </div>
              
              {/* Дата начала */}
              <div className="form-group">
                <label htmlFor="startDate" className="label flex items-center">
                  <Icon icon="lucide:calendar" className="mr-2" /> Дата начала
                </label>
                <DatePicker
                  id="startDate"
                  selected={formik.values.startDate}
                  onChange={(date) => formik.setFieldValue('startDate', date)}
                  selectsStart
                  startDate={formik.values.startDate}
                  endDate={formik.values.endDate}
                  minDate={new Date()}
                  dateFormat="dd.MM.yyyy"
                  className={`input w-full ${
                    formik.touched.startDate && formik.errors.startDate ? 'border-red-500' : ''
                  }`}
                  placeholderText="Выберите дату начала"
                />
                {formik.touched.startDate && formik.errors.startDate ? (
                  <div className="text-red-500 mt-1 text-sm">{formik.errors.startDate}</div>
                ) : null}
              </div>
              
              {/* Дата окончания */}
              <div className="form-group">
                <label htmlFor="endDate" className="label flex items-center">
                  <Icon icon="lucide:calendar" className="mr-2" /> Дата окончания
                </label>
                <DatePicker
                  id="endDate"
                  selected={formik.values.endDate}
                  onChange={(date) => formik.setFieldValue('endDate', date)}
                  selectsEnd
                  startDate={formik.values.startDate}
                  endDate={formik.values.endDate}
                  minDate={formik.values.startDate || new Date()}
                  dateFormat="dd.MM.yyyy"
                  className={`input w-full ${
                    formik.touched.endDate && formik.errors.endDate ? 'border-red-500' : ''
                  }`}
                  placeholderText="Выберите дату окончания"
                />
                {formik.touched.endDate && formik.errors.endDate ? (
                  <div className="text-red-500 mt-1 text-sm">{formik.errors.endDate}</div>
                ) : null}
              </div>
              
              {/* Промокод */}
              <div className="form-group col-span-2">
                <label htmlFor="promoCode" className="label flex items-center">
                  <Icon icon="lucide:credit-card" className="mr-2" /> Промокод (необязательно)
                </label>
                <input
                  id="promoCode"
                  name="promoCode"
                  type="text"
                  placeholder="Введите промокод для получения скидки"
                  className="input w-full"
                  {...formik.getFieldProps('promoCode')}
                />
              </div>
            </div>
            
            {/* Информация о стоимости */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center mb-2">
                <Icon icon="lucide:info" className="mr-2 text-primary-600" />
                <h3 className="text-lg font-semibold">Информация о стоимости</h3>
              </div>
              <div className="mt-2">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Стоимость аренды:</span>
                  <span className="font-semibold">{totalCost} ₽</span>
                </div>
                {/* Здесь могут быть дополнительные услуги */}
                <div className="flex justify-between items-center py-2 mt-2">
                  <span className="text-lg font-bold">Итого к оплате:</span>
                  <span className="text-lg font-bold text-primary-600">{totalCost} ₽</span>
                </div>
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="btn btn-outline"
                disabled={loading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Создание...
                  </span>
                ) : (
                  'Создать бронирование'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;
