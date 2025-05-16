import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/forms/SearchForm';
import CarCard from '../components/cars/CarCard';
import { FiClock, FiMapPin, FiCalendar, FiStar, FiPhone } from 'react-icons/fi';
import anime from 'animejs';
import { carService } from '../api/services';

const HomePage = () => {
  const [popularCars, setPopularCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef(null);

  // Загрузка популярных автомобилей
  useEffect(() => {
    const fetchPopularCars = async () => {
      try {
        const response = await carService.getCars({ limit: 4 });
        setPopularCars(response.data.cars || []);
      } catch (error) {
        console.error('Ошибка при загрузке популярных автомобилей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularCars();
  }, []);

  // Анимация героя при загрузке страницы
  useEffect(() => {
    if (heroRef.current) {
      anime({
        targets: '.hero-animation',
        opacity: [0, 1],
        translateY: [50, 0],
        delay: anime.stagger(100),
        easing: 'easeOutQuad',
        duration: 800
      });
    }
  }, []);

  // Обработчик поиска
  const handleSearch = (searchParams) => {
    // Редирект на страницу поиска с параметрами
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) queryParams.append('startDate', searchParams.startDate.toISOString());
    if (searchParams.endDate) queryParams.append('endDate', searchParams.endDate.toISOString());
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.category) queryParams.append('category', searchParams.category);
    
    window.location.href = `/search?${queryParams.toString()}`;
  };

  return (
    <div>
      {/* Hero секция */}
      <div 
        ref={heroRef}
        className="min-h-screen flex items-center relative"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1553729459-efe14ef6055d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-4 pt-24">
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 hero-animation">
              Аренда автомобилей на любой срок
            </h1>
            <p className="text-xl text-white mb-8 hero-animation">
              Выбирайте автомобиль и арендуйте его на любой срок — от нескольких минут до нескольких месяцев. Никаких скрытых платежей, только прозрачные условия аренды.
            </p>
            <div className="flex space-x-4 hero-animation">
              <Link to="/search" className="btn btn-primary">
                Найти автомобиль
              </Link>
              <Link to="/tariffs" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                Тарифы
              </Link>
            </div>
          </div>
          
          {/* Форма поиска */}
          <div className="mt-10 hero-animation">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Секция преимуществ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Почему выбирают CarShare</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiClock className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">Быстро и удобно</h3>
              <p className="text-gray-600">
                Бронируйте автомобиль за несколько кликов через наше мобильное приложение или веб-сайт.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiMapPin className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">Много точек выдачи</h3>
              <p className="text-gray-600">
                Наши автомобили находятся в разных районах города, чтобы вы могли выбрать ближайший.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiCalendar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">Гибкие тарифы</h3>
              <p className="text-gray-600">
                От поминутной до месячной аренды — выбирайте тариф, который подходит именно вам.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiStar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4">Отличный сервис</h3>
              <p className="text-gray-600">
                Чистые автомобили, круглосуточная поддержка и привлекательные бонусы для постоянных клиентов.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Секция популярных автомобилей */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Популярные автомобили</h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/search" className="btn btn-primary">
              Все автомобили
            </Link>
          </div>
        </div>
      </section>

      {/* Секция о долгосрочной аренде */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Долгосрочная аренда автомобилей</h2>
              <p className="text-gray-300 mb-4">
                Долгосрочная аренда — это идеальное решение, если вам нужен автомобиль на неделю, месяц или даже дольше. Это выгоднее, чем стандартный каршеринг или классический прокат автомобилей.
              </p>
              <p className="text-gray-300 mb-8">
                Мы предлагаем гибкие условия и специальные скидки при долгосрочной аренде. Вы можете выбрать любой автомобиль из нашего автопарка и арендовать его на нужный срок.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary-600 p-1 rounded mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Скидки до 15% при аренде на месяц</p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-600 p-1 rounded mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Возможность продления аренды в любой момент</p>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary-600 p-1 rounded mr-3 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p>Бесплатная доставка автомобиля при аренде от недели</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/tariffs#long-term" className="btn btn-primary">
                  Узнать подробнее
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                alt="Долгосрочная аренда" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary-600 p-4 rounded-lg shadow-lg">
                <p className="text-3xl font-bold">-15%</p>
                <p className="text-sm">на месячную аренду</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы арендовать автомобиль прямо сейчас?</h2>
          <p className="text-xl mb-8 max-w-xl mx-auto">
            Присоединяйтесь к тысячам довольных клиентов, которые уже пользуются нашим сервисом
          </p>
          
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <Link to="/register" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-600">
              Зарегистрироваться
            </Link>
            <Link to="/search" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Найти автомобиль
            </Link>
          </div>
          
          <div className="mt-12 flex justify-center items-center">
            <FiPhone className="text-2xl mr-3" />
            <p className="text-xl font-semibold">8 (800) 123-45-67</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
