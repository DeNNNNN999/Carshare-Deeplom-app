import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { rentalPlanService } from '../../api/services';
import { FiEdit, FiToggleLeft, FiToggleRight, FiPlus, FiDollarSign, FiClock } from 'react-icons/fi';
import moment from 'moment';

const TariffManagementPage = () => {
  const [rentalPlans, setRentalPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRentalPlans();
  }, []);

  const fetchRentalPlans = async () => {
    setLoading(true);
    try {
      const response = await rentalPlanService.getRentalPlans();
      setRentalPlans(response.data.rentalPlans || []);
    } catch (err) {
      setError('Не удалось загрузить тарифные планы. Пожалуйста, попробуйте позже.');
      console.error('Error fetching rental plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (planId, currentStatus) => {
    try {
      await rentalPlanService.updateRentalPlanStatus(planId, !currentStatus);
      // Обновляем список тарифных планов
      fetchRentalPlans();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось изменить статус тарифного плана');
    }
  };

  const getDurationTypeLabel = (type) => {
    switch (type) {
      case 'minute': return 'минута';
      case 'hour': return 'час';
      case 'day': return 'день';
      case 'week': return 'неделя';
      case 'month': return 'месяц';
      default: return type;
    }
  };

  // Функция для склонения слов в зависимости от числа
  const pluralize = (number, one, two, five) => {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
      return five;
    }
    n %= 10;
    if (n === 1) {
      return one;
    }
    if (n >= 2 && n <= 4) {
      return two;
    }
    return five;
  };

  const formatDuration = (durationType, minDuration, maxDuration) => {
    const typeLabel = getDurationTypeLabel(durationType);
    
    if (minDuration === maxDuration) {
      return `${minDuration} ${pluralize(minDuration, 
        typeLabel === 'минута' ? 'минута' : typeLabel === 'час' ? 'час' : typeLabel === 'день' ? 'день' : typeLabel === 'неделя' ? 'неделя' : 'месяц', 
        typeLabel === 'минута' ? 'минуты' : typeLabel === 'час' ? 'часа' : typeLabel === 'день' ? 'дня' : typeLabel === 'неделя' ? 'недели' : 'месяца', 
        typeLabel === 'минута' ? 'минут' : typeLabel === 'час' ? 'часов' : typeLabel === 'день' ? 'дней' : typeLabel === 'неделя' ? 'недель' : 'месяцев'
      )}`;
    } else {
      return `${minDuration} - ${maxDuration} ${pluralize(maxDuration, 
        typeLabel === 'минута' ? 'минута' : typeLabel === 'час' ? 'час' : typeLabel === 'день' ? 'день' : typeLabel === 'неделя' ? 'неделя' : 'месяц', 
        typeLabel === 'минута' ? 'минуты' : typeLabel === 'час' ? 'часа' : typeLabel === 'день' ? 'дня' : typeLabel === 'неделя' ? 'недели' : 'месяца', 
        typeLabel === 'минута' ? 'минут' : typeLabel === 'час' ? 'часов' : typeLabel === 'день' ? 'дней' : typeLabel === 'неделя' ? 'недель' : 'месяцев'
      )}`;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление тарифами</h1>
        <Link to="/admin/tariffs/new" className="btn btn-primary flex items-center">
          <FiPlus className="mr-2" />
          Добавить тариф
        </Link>
      </div>
      
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
          {rentalPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rentalPlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`bg-white shadow rounded-lg overflow-hidden ${!plan.isActive ? 'opacity-70' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold">
                        {plan.name}
                      </h3>
                      <button
                        onClick={() => handleToggleStatus(plan.id, plan.isActive)}
                        className={`p-1 rounded-full ${plan.isActive ? 'text-green-600 hover:text-green-800' : 'text-gray-400 hover:text-gray-600'}`}
                        title={plan.isActive ? 'Деактивировать' : 'Активировать'}
                      >
                        {plan.isActive ? <FiToggleRight className="h-6 w-6" /> : <FiToggleLeft className="h-6 w-6" />}
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center">
                        <FiClock className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Длительность</div>
                          <div>{formatDuration(plan.durationType, plan.minDuration, plan.maxDuration)}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <FiDollarSign className="text-gray-500 mr-2" />
                        <div>
                          <div className="text-sm text-gray-600">Стоимость за {getDurationTypeLabel(plan.durationType)}</div>
                          <div>{Number(plan.pricePerUnit).toFixed(2)} ₽</div>
                        </div>
                      </div>
                      
                      {plan.basePrice > 0 && (
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-600">Базовая стоимость</div>
                            <div>{Number(plan.basePrice).toFixed(2)} ₽</div>
                          </div>
                        </div>
                      )}
                      
                      {plan.discountPercent > 0 && (
                        <div className="flex items-center">
                          <FiDollarSign className="text-gray-500 mr-2" />
                          <div>
                            <div className="text-sm text-gray-600">Скидка</div>
                            <div>{plan.discountPercent}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t">
                      <div className="text-sm text-gray-600">
                        Обновлено: {moment(plan.updatedAt).format('DD.MM.YYYY')}
                      </div>
                      
                      <Link 
                        to={`/admin/tariffs/${plan.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <FiEdit className="mr-1" />
                        Редактировать
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">Тарифные планы не найдены</div>
              <Link to="/admin/tariffs/new" className="btn btn-primary">
                Добавить тариф
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TariffManagementPage;
