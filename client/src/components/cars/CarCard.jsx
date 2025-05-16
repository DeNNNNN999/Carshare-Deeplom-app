import { Link } from 'react-router-dom';
import { FiClock, FiCalendar, FiDollarSign, FiStar } from 'react-icons/fi';
import { useEffect, useRef } from 'react';
import anime from 'animejs';

const CarCard = ({ car, index }) => {
  const cardRef = useRef(null);
  
  // Анимация карточки при монтировании
  useEffect(() => {
    anime({
      targets: cardRef.current,
      opacity: [0, 1],
      translateY: [50, 0],
      easing: 'easeOutQuad',
      duration: 500,
      delay: index * 100
    });
  }, [index]);
  
  // Получение полного имени автомобиля
  const carName = `${car.brand} ${car.model}`;
  
  // Обработка отсутствующего изображения
  const fallbackImage = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop';
  const imageUrl = car.imageUrl || fallbackImage;
  
  // Проверка доступности автомобиля
  const isAvailable = car.status === 'available';
  
  // Преобразование рейтинга в целое число для отображения звездочек
  const averageRating = parseFloat(car.averageRating) || 0;
  const rating = Math.round(averageRating);
  
  return (
    <div ref={cardRef} className="card group hover:shadow-xl transition-shadow duration-300">
      {/* Изображение автомобиля */}
      <div className="relative overflow-hidden rounded-t-lg h-48">
        <img 
          src={imageUrl} 
          alt={carName} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        {!isAvailable && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Недоступен</span>
          </div>
        )}
        {car.category && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2 py-1 rounded">
            {car.category}
          </div>
        )}
      </div>
      
      {/* Информация об автомобиле */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold">{carName}</h3>
          {rating > 0 && (
            <div className="flex items-center">
              <FiStar className="text-yellow-500 mr-1" />
              <span className="text-sm">{averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        {/* Характеристики автомобиля */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FiClock className="mr-2 text-primary-500" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar className="mr-2 text-primary-500" />
            <span>{car.year} год</span>
          </div>
          <div className="flex items-center">
            <svg className="mr-2 text-primary-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{car.fuelType}</span>
          </div>
          <div className="flex items-center">
            <svg className="mr-2 text-primary-500 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{car.seats} мест</span>
          </div>
        </div>
        
        {/* Цены */}
        <div className="flex justify-between items-center mb-4 text-sm">
          <div className="flex items-center">
            <FiDollarSign className="text-green-600 mr-1" />
            <span className="font-semibold text-green-600">{car.hourlyRate} ₽/час</span>
          </div>
          <div className="flex items-center">
            <FiDollarSign className="text-green-600 mr-1" />
            <span className="font-semibold text-green-600">{car.dailyRate} ₽/день</span>
          </div>
        </div>
        
        {/* Кнопки действий */}
        <div className="flex justify-between items-center">
          <Link 
            to={`/cars/${car.id}`}
            className="btn btn-outline w-full"
          >
            Подробнее
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
