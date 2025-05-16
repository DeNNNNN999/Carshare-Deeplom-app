import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { rentalPlanService } from '../api/services';
import { FiCheck, FiChevronDown, FiChevronUp, FiClock, FiCalendar, FiPercent } from 'react-icons/fi';
import anime from 'animejs';

const TariffPage = () => {
  const [rentalPlans, setRentalPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('minute');
  const [longTermExpanded, setLongTermExpanded] = useState(false);
  
  // Получение хэша из URL
  const location = useLocation();
  
  // Загрузка тарифных планов
  useEffect(() => {
    const fetchRentalPlans = async () => {
      setLoading(true);
      setError('');
      
      try {
        const response = await rentalPlanService.getRentalPlans();
        setRentalPlans(response.data.rentalPlans || []);
      } catch (err) {
        console.error('Ошибка при загрузке тарифных планов:', err);
        setError('Не удалось загрузить тарифные планы. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRentalPlans();
  }, []);
  
  // Установка активной вкладки из URL хэша
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (['minute', 'hour', 'day', 'week', 'month', 'long-term'].includes(hash)) {
      setActiveTab(hash);
      
      // Если хэш указывает на долгосрочную аренду, раскрываем подробности
      if (hash === 'long-term') {
        setLongTermExpanded(true);
        
        // Прокрутка к блоку долгосрочной аренды
        const element = document.getElementById('long-term');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location.hash]);
  
  // Анимация при смене вкладки
  useEffect(() => {
    anime({
      targets: '.tariff-card',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 500
    });
  }, [activeTab]);
  
  // Получение тарифных планов для выбранной вкладки
  const getFilteredPlans = () => {
    return rentalPlans.filter((plan) => plan.durationType === activeTab);
  };
  
  // Переключение вкладки
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    // Обновляем URL хэш
    window.location.hash = tab;
  };
  
  // Переключение состояния блока долгосрочной аренды
  const toggleLongTermInfo = () => {
    setLongTermExpanded(!longTermExpanded);
    
    // Анимация разворачивания/сворачивания
    anime({
      targets: '.long-term-content',
      height: longTermExpanded ? [document.querySelector('.long-term-content').scrollHeight, 0] : [0, document.querySelector('.long-term-content').scrollHeight],
      opacity: longTermExpanded ? [1, 0] : [0, 1],
      duration: 400,
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
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center">Тарифы</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Выбирайте тарифный план, который идеально подходит для ваших потребностей — 
          от коротких поездок до долгосрочной аренды
        </p>
        
        {/* Вкладки тарифов */}
        <div className="flex overflow-x-auto mb-8 pb-4 md:justify-center">
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'minute' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('minute')}
            >
              <FiClock className="inline-block mr-1" />
              Поминутный
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'hour' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('hour')}
            >
              <FiClock className="inline-block mr-1" />
              Почасовой
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'day' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('day')}
            >
              <FiCalendar className="inline-block mr-1" />
              Дневной
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'week' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('week')}
            >
              <FiCalendar className="inline-block mr-1" />
              Недельный
            </button>
            <button
              className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
                activeTab === 'month' ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleTabChange('month')}
            >
              <FiCalendar className="inline-block mr-1" />
              Месячный
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {/* Карточки тарифов */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {getFilteredPlans().map((plan) => (
            <div key={plan.id} className="tariff-card bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary-600 text-white p-6">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="mt-2 opacity-90">{plan.description}</p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold">{plan.basePrice} ₽</span>
                  <span className="text-gray-600">
                    {activeTab === 'minute' && ' + цена за минуту'}
                    {activeTab === 'hour' && ' + цена за час'}
                    {activeTab === 'day' && ' + цена за день'}
                    {activeTab === 'week' && ' + цена за неделю'}
                    {activeTab === 'month' && ' + цена за месяц'}
                  </span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Базовый тариф: {plan.basePrice} ₽</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Доступны все модели автомобилей</span>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="text-green-500 mt-1 mr-2" />
                    <span>Минимальная длительность: {plan.minDuration} 
                      {activeTab === 'minute' && ' мин.'}
                      {activeTab === 'hour' && ' ч.'}
                      {activeTab === 'day' && ' дн.'}
                      {activeTab === 'week' && ' нед.'}
                      {activeTab === 'month' && ' мес.'}
                    </span>
                  </li>
                  {plan.maxDuration && (
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Максимальная длительность: {plan.maxDuration} 
                        {activeTab === 'minute' && ' мин.'}
                        {activeTab === 'hour' && ' ч.'}
                        {activeTab === 'day' && ' дн.'}
                        {activeTab === 'week' && ' нед.'}
                        {activeTab === 'month' && ' мес.'}
                      </span>
                    </li>
                  )}
                  {plan.discountPercent > 0 && (
                    <li className="flex items-start text-green-600">
                      <FiPercent className="mt-1 mr-2" />
                      <span>Скидка: {plan.discountPercent}%</span>
                    </li>
                  )}
                </ul>
                
                <Link to="/search" className="btn btn-primary w-full">
                  Выбрать автомобиль
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Долгосрочная аренда */}
        <div id="long-term" className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggleLongTermInfo}
          >
            <h2 className="text-2xl font-bold">Преимущества долгосрочной аренды</h2>
            {longTermExpanded ? (
              <FiChevronUp className="text-2xl text-gray-500" />
            ) : (
              <FiChevronDown className="text-2xl text-gray-500" />
            )}
          </div>
          
          <div 
            className={`long-term-content overflow-hidden ${
              longTermExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'
            }`}
          >
            <div className="pt-6">
              <p className="text-lg text-gray-700 mb-6">
                Долгосрочная аренда автомобиля — идеальное решение, если вам нужен автомобиль на неделю, месяц или даже дольше. 
                Это выгоднее, чем стандартный каршеринг или классический прокат автомобилей.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-primary-600">Преимущества</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Скидки до 15% при аренде на месяц</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Фиксированная стоимость без скрытых платежей</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Бесплатная доставка автомобиля при аренде от недели</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Возможность продления аренды в любой момент</span>
                    </li>
                    <li className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-2" />
                      <span>Приоритетная поддержка 24/7</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4 text-primary-600">Выгода по сравнению с обычной арендой</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">Обычная дневная аренда на 30 дней</div>
                      <div className="font-bold">2 500 ₽ × 30 = 75 000 ₽</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-gray-600">Месячная аренда со скидкой 15%</div>
                      <div className="font-bold">75 000 ₽ - 15% = 63 750 ₽</div>
                    </div>
                    <div className="text-green-600 font-bold">
                      Ваша экономия: 11 250 ₽
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Как арендовать автомобиль на длительный срок?</h3>
                <ol className="space-y-3 list-decimal pl-5">
                  <li>Выберите автомобиль в нашем каталоге</li>
                  <li>Укажите даты начала и окончания аренды</li>
                  <li>Выберите тарифный план "Недельный" или "Месячный"</li>
                  <li>Завершите бронирование и оплатите аренду</li>
                  <li>Получите автомобиль в выбранное время</li>
                </ol>
                
                <div className="mt-6 text-center">
                  <Link to="/search" className="btn btn-primary">
                    Найти автомобиль для долгосрочной аренды
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-8 text-center">Часто задаваемые вопросы</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Что входит в стоимость аренды?</h3>
              <p className="text-gray-700">
                В стоимость аренды включено: страховка, техническое обслуживание, сезонная смена шин. 
                Топливо оплачивается отдельно.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Есть ли ограничения по пробегу?</h3>
              <p className="text-gray-700">
                При поминутной и почасовой аренде ограничений нет. При дневной и долгосрочной аренде действует лимит 
                200 км в день. Превышение оплачивается по тарифу 5 ₽/км.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Могу ли я продлить аренду?</h3>
              <p className="text-gray-700">
                Да, вы можете продлить аренду через приложение в любой момент, если автомобиль не забронирован 
                другим пользователем на это время.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold mb-2">Как происходит оплата?</h3>
              <p className="text-gray-700">
                Оплата производится при бронировании. Для долгосрочной аренды возможна оплата в рассрочку 
                (50% предоплата, остальное через 15 дней).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TariffPage;
