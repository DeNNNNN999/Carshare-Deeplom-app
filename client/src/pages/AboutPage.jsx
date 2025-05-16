import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiCalendar, FiShield, FiThumbsUp, FiSmile } from 'react-icons/fi';
import anime from 'animejs';

const AboutPage = () => {
  // Анимация при загрузке страницы
  useEffect(() => {
    anime({
      targets: '.about-section',
      opacity: [0, 1],
      translateY: [50, 0],
      delay: anime.stagger(200),
      easing: 'easeOutQuad',
      duration: 800
    });
    
    anime({
      targets: '.team-member',
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 600
    });
  }, []);
  
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        {/* Hero секция */}
        <div className="text-center max-w-3xl mx-auto mb-16 about-section">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">О компании CarShare</h1>
          <p className="text-xl text-gray-600">
            Мы предоставляем современный и удобный сервис аренды автомобилей любого класса на любой срок — 
            от нескольких минут до нескольких месяцев.
          </p>
        </div>
        
        {/* Миссия компании */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16 about-section">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Наша миссия</h2>
            <p className="text-lg mb-4">
              Наша миссия — сделать передвижение по городу доступным, удобным и приятным для каждого.
              Мы стремимся предлагать современные решения для мобильности, которые позволяют людям отказаться от личного 
              автомобиля без потери комфорта и свободы передвижения.
            </p>
            <p className="text-lg">
              CarShare создан, чтобы вы могли пользоваться автомобилем только когда он вам действительно нужен — 
              без забот о страховке, обслуживании, парковке и других расходах, связанных с владением личным 
              автомобилем.
            </p>
          </div>
        </div>
        
        {/* Преимущества */}
        <div className="mb-16 about-section">
          <h2 className="text-2xl font-bold mb-12 text-center">Почему выбирают CarShare</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiClock className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Экономия времени</h3>
              <p className="text-gray-600 text-center">
                Заказывайте автомобиль за несколько кликов и забирайте его в ближайшей точке.
                Никаких очередей и бумажной волокиты.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiMapPin className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Широкая сеть</h3>
              <p className="text-gray-600 text-center">
                Наши автомобили расположены в разных районах города, что позволяет найти подходящий вариант рядом с вами.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiCalendar className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Гибкие условия</h3>
              <p className="text-gray-600 text-center">
                От поминутной до месячной аренды — выбирайте автомобиль на тот срок, который вам нужен.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiShield className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Безопасность</h3>
              <p className="text-gray-600 text-center">
                Все наши автомобили регулярно проходят техническое обслуживание и страхуются по полному КАСКО.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiThumbsUp className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Качество</h3>
              <p className="text-gray-600 text-center">
                Мы предлагаем только современные и комфортные автомобили различных классов и марок.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-primary-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                <FiSmile className="text-primary-600 text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Поддержка 24/7</h3>
              <p className="text-gray-600 text-center">
                Наша служба поддержки работает круглосуточно и готова помочь в любой ситуации.
              </p>
            </div>
          </div>
        </div>
        
        {/* История компании */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16 about-section">
          <h2 className="text-2xl font-bold mb-8 text-center">Наша история</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="border-l-4 border-primary-500 pl-6 mb-8">
              <div className="text-lg font-bold mb-2">2018</div>
              <p className="text-gray-600">
                Основание компании и запуск первого автопарка из 50 автомобилей в Москве. Начало работы приложения CarShare.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6 mb-8">
              <div className="text-lg font-bold mb-2">2019</div>
              <p className="text-gray-600">
                Расширение автопарка до 200 автомобилей и выход в Санкт-Петербург. Запуск почасовой аренды.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6 mb-8">
              <div className="text-lg font-bold mb-2">2020</div>
              <p className="text-gray-600">
                Внедрение длительной аренды и программы лояльности. Увеличение автопарка до 500 автомобилей.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6 mb-8">
              <div className="text-lg font-bold mb-2">2021</div>
              <p className="text-gray-600">
                Расширение географии до 5 городов. Запуск сервиса доставки автомобиля. Добавление премиальных автомобилей.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6 mb-8">
              <div className="text-lg font-bold mb-2">2022</div>
              <p className="text-gray-600">
                Запуск корпоративных программ каршеринга. Внедрение электромобилей в автопарк.
              </p>
            </div>
            
            <div className="border-l-4 border-primary-500 pl-6">
              <div className="text-lg font-bold mb-2">2023</div>
              <p className="text-gray-600">
                Полное обновление приложения и веб-платформы. Автопарк достиг 1000 автомобилей различных классов.
              </p>
            </div>
          </div>
        </div>
        
        {/* Команда */}
        <div className="mb-16 about-section">
          <h2 className="text-2xl font-bold mb-12 text-center">Наша команда</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="team-member bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                  alt="Александр Петров" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Александр Петров</h3>
                <p className="text-gray-600 mb-2">Генеральный директор</p>
                <p className="text-sm text-gray-500">
                  Более 15 лет опыта в автомобильной индустрии и сфере транспортных услуг.
                </p>
              </div>
            </div>
            
            <div className="team-member bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=388&q=80" 
                  alt="Елена Соколова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Елена Соколова</h3>
                <p className="text-gray-600 mb-2">Технический директор</p>
                <p className="text-sm text-gray-500">
                  Отвечает за разработку и улучшение технологической платформы компании.
                </p>
              </div>
            </div>
            
            <div className="team-member bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" 
                  alt="Дмитрий Иванов" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Дмитрий Иванов</h3>
                <p className="text-gray-600 mb-2">Операционный директор</p>
                <p className="text-sm text-gray-500">
                  Управляет повседневной деятельностью компании и автопарком.
                </p>
              </div>
            </div>
            
            <div className="team-member bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=461&q=80" 
                  alt="Мария Кузнецова" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg">Мария Кузнецова</h3>
                <p className="text-gray-600 mb-2">Директор по маркетингу</p>
                <p className="text-sm text-gray-500">
                  Разрабатывает маркетинговую стратегию и продвижение сервиса.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-primary-600 text-white rounded-lg shadow-lg p-8 text-center about-section">
          <h2 className="text-2xl font-bold mb-6">Присоединяйтесь к CarShare сегодня</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Зарегистрируйтесь и получите доступ к автопарку современных автомобилей с гибкими условиями аренды.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100">
              Зарегистрироваться
            </Link>
            <Link to="/search" className="btn border-2 border-white text-white hover:bg-primary-700">
              Найти автомобиль
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
