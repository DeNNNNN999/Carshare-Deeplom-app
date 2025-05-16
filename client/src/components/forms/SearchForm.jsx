import { useState, useEffect } from 'react';
import { FiSearch, FiCalendar, FiMapPin } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import anime from 'animejs';

const SearchForm = ({ onSearch, initialValues = {} }) => {
  const [startDate, setStartDate] = useState(initialValues.startDate || null);
  const [endDate, setEndDate] = useState(initialValues.endDate || null);
  const [location, setLocation] = useState(initialValues.location || '');
  const [category, setCategory] = useState(initialValues.category || '');
  
  // Анимация формы при монтировании
  useEffect(() => {
    anime({
      targets: '.search-form-field',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(100),
      easing: 'easeOutQuad',
      duration: 500
    });
  }, []);
  
  // Обработчик отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const searchParams = {
      startDate,
      endDate,
      location,
      category
    };
    
    // Анимация кнопки при отправке
    anime({
      targets: '.search-button',
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
    
    onSearch(searchParams);
  };
  
  // Категории автомобилей
  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'Седан', label: 'Седан' },
    { value: 'SUV', label: 'Внедорожник' },
    { value: 'Хэтчбек', label: 'Хэтчбек' },
    { value: 'Универсал', label: 'Универсал' },
    { value: 'Минивэн', label: 'Минивэн' }
  ];
  
  return (
    <form onSubmit={handleSubmit} className="card shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Дата начала */}
        <div className="search-form-field">
          <label htmlFor="startDate" className="label">
            Дата начала
          </label>
          <div className="relative">
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              placeholderText="Выберите дату"
              className="input w-full pl-10"
              dateFormat="dd.MM.yyyy"
            />
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        {/* Дата окончания */}
        <div className="search-form-field">
          <label htmlFor="endDate" className="label">
            Дата окончания
          </label>
          <div className="relative">
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate || new Date()}
              placeholderText="Выберите дату"
              className="input w-full pl-10"
              dateFormat="dd.MM.yyyy"
            />
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        {/* Местоположение */}
        <div className="search-form-field">
          <label htmlFor="location" className="label">
            Местоположение
          </label>
          <div className="relative">
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Введите адрес или район"
              className="input w-full pl-10"
            />
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
        </div>
        
        {/* Категория */}
        <div className="search-form-field">
          <label htmlFor="category" className="label">
            Категория
          </label>
          <div className="relative">
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input w-full appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Кнопка поиска */}
      <div className="mt-8 search-form-field">
        <button
          type="submit"
          className="search-button btn btn-primary w-full md:w-auto flex items-center justify-center"
        >
          <FiSearch className="mr-2" />
          Найти автомобиль
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
