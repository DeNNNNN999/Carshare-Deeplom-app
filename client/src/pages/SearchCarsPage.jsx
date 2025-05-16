import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { carService, locationService } from '../api/services';
import SearchForm from '../components/forms/SearchForm';
import CarCard from '../components/cars/CarCard';
import ServerErrorNotification from '../components/ui/ServerErrorNotification';
import NoDataAvailable from '../components/ui/NoDataAvailable';
import { FiFilter, FiMapPin, FiGrid, FiList, FiSliders, FiX } from 'react-icons/fi';
import anime from 'animejs';

const SearchCarsPage = () => {
  // Состояния
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' или 'list'
  const [totalCars, setTotalCars] = useState(0);
  
  // Параметры фильтрации
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    category: '',
    transmission: '',
    fuelType: '',
    minSeats: '',
    maxPrice: '',
    startDate: null,
    endDate: null,
    location: '',
    latitude: null,
    longitude: null,
    radius: 5,
    sort: 'price_asc'
  });
  
  // Извлечение параметров из URL
  const location = useLocation();
  
  // При изменении URL обновляем фильтры
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    // Преобразование строковых параметров в объекты Date
    const startDateStr = params.get('startDate');
    const endDateStr = params.get('endDate');
    
    const newFilters = {
      ...filters,
      startDate: startDateStr ? new Date(startDateStr) : null,
      endDate: endDateStr ? new Date(endDateStr) : null,
      category: params.get('category') || '',
      location: params.get('location') || '',
    };
    
    // Если указан адрес, получаем координаты
    if (newFilters.location) {
      // В реальном приложении здесь будет запрос к геокодеру
      // для преобразования адреса в координаты
      // Для примера используем фиксированные координаты Москвы
      newFilters.latitude = 55.7558;
      newFilters.longitude = 37.6173;
    }
    
    setFilters(newFilters);
    
    // Поиск автомобилей с новыми фильтрами
    searchCars(newFilters);
  }, [location.search]);
  
  // Поиск автомобилей
  const searchCars = async (searchFilters) => {
    setLoading(true);
    setError('');
    setCars([]);
    setTotalCars(0);
    
    try {
      let params = {};
      
      // Добавляем параметры для поиска
      if (searchFilters.startDate) params.startDate = searchFilters.startDate.toISOString();
      if (searchFilters.endDate) params.endDate = searchFilters.endDate.toISOString();
      if (searchFilters.brand) params.brand = searchFilters.brand;
      if (searchFilters.model) params.model = searchFilters.model;
      if (searchFilters.category) params.category = searchFilters.category;
      if (searchFilters.transmission) params.transmission = searchFilters.transmission;
      if (searchFilters.fuelType) params.fuelType = searchFilters.fuelType;
      if (searchFilters.minSeats) params.minSeats = searchFilters.minSeats;
      if (searchFilters.maxPrice) params.maxPrice = searchFilters.maxPrice;
      
      // Добавляем обработку ошибки по таймауту
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 секунд таймаут
      
      try {
        // Если есть координаты, ищем автомобили рядом
        if (searchFilters.latitude && searchFilters.longitude) {
          const locationResponse = await locationService.getCarsInRadius({
            latitude: searchFilters.latitude,
            longitude: searchFilters.longitude,
            radius: searchFilters.radius || 5
          }, { signal: controller.signal });
          
          clearTimeout(timeoutId);
          
          if (locationResponse.data && Array.isArray(locationResponse.data.cars)) {
            setCars(locationResponse.data.cars);
            setTotalCars(locationResponse.data.count || 0);
          } else {
            setCars([]);
            setTotalCars(0);
            setError('Данные не получены в ожидаемом формате. Пожалуйста, попробуйте позже.');
          }
        } else {
          // Иначе ищем по другим параметрам
          const response = await carService.getCars(params, { signal: controller.signal });
          
          clearTimeout(timeoutId);
          
          if (response.data && Array.isArray(response.data.cars)) {
            setCars(response.data.cars);
            setTotalCars(response.data.count || 0);
          } else {
            setCars([]);
            setTotalCars(0);
            setError('Данные не получены в ожидаемом формате. Пожалуйста, попробуйте позже.');
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          setError('Превышено время ожидания ответа от сервера. Пожалуйста, попробуйте позже.');
        } else {
          throw fetchError;
        }
      }
    } catch (err) {
      console.error('Ошибка при поиске автомобилей:', err);
      if (err.response && err.response.status) {
        switch (err.response.status) {
          case 404:
            setError('Автомобили не найдены. Попробуйте изменить параметры поиска.');
            break;
          case 400:
            setError('Некорректный запрос. Пожалуйста, проверьте введенные данные.');
            break;
          case 500:
            setError('Ошибка на сервере. Пожалуйста, попробуйте позже.');
            break;
          default:
            setError('Не удалось загрузить список автомобилей. Пожалуйста, попробуйте позже.');
        }
      } else {
        setError('Не удалось загрузить список автомобилей. Проверьте подключение к интернету.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик отправки формы поиска
  const handleSearch = (searchParams) => {
    // Формируем URL параметры
    const queryParams = new URLSearchParams();
    if (searchParams.startDate) queryParams.append('startDate', searchParams.startDate.toISOString());
    if (searchParams.endDate) queryParams.append('endDate', searchParams.endDate.toISOString());
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.category) queryParams.append('category', searchParams.category);
    
    // Обновляем URL с новыми параметрами (без перезагрузки страницы)
    window.history.pushState(
      {},
      '',
      `${window.location.pathname}?${queryParams.toString()}`
    );
    
    // Обновляем фильтры и выполняем поиск
    const newFilters = {
      ...filters,
      ...searchParams,
    };
    
    setFilters(newFilters);
    searchCars(newFilters);
  };
  
  // Обработчик изменения фильтров
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Применение фильтров
  const applyFilters = () => {
    searchCars(filters);
    
    // Закрываем панель фильтров на мобильных устройствах
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
    
    // Анимация для мобильной панели
    anime({
      targets: '.filter-panel',
      translateX: ['0%', '-100%'],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };
  
  // Сброс фильтров
  const resetFilters = () => {
    const basicFilters = {
      brand: '',
      model: '',
      category: '',
      transmission: '',
      fuelType: '',
      minSeats: '',
      maxPrice: '',
      sort: 'price_asc'
    };
    
    // Сохраняем только даты и местоположение
    setFilters({
      ...basicFilters,
      startDate: filters.startDate,
      endDate: filters.endDate,
      location: filters.location,
      latitude: filters.latitude,
      longitude: filters.longitude,
      radius: filters.radius
    });
  };
  
  // Переключение режима отображения (сетка/список)
  const toggleViewMode = (mode) => {
    setViewMode(mode);
    
    // Анимация при переключении режима
    anime({
      targets: '.car-container',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(50),
      easing: 'easeOutQuad',
      duration: 300
    });
  };
  
  // Параметры фильтрации
  const brands = [
    { value: '', label: 'Все марки' },
    { value: 'Audi', label: 'Audi' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Ford', label: 'Ford' },
    { value: 'Honda', label: 'Honda' },
    { value: 'Hyundai', label: 'Hyundai' },
    { value: 'Kia', label: 'Kia' },
    { value: 'Mercedes', label: 'Mercedes-Benz' },
    { value: 'Nissan', label: 'Nissan' },
    { value: 'Skoda', label: 'Skoda' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Volkswagen', label: 'Volkswagen' },
  ];
  
  const categories = [
    { value: '', label: 'Все категории' },
    { value: 'Седан', label: 'Седан' },
    { value: 'SUV', label: 'Внедорожник' },
    { value: 'Хэтчбек', label: 'Хэтчбек' },
    { value: 'Универсал', label: 'Универсал' },
    { value: 'Минивэн', label: 'Минивэн' }
  ];
  
  const transmissions = [
    { value: '', label: 'Любая КПП' },
    { value: 'Автомат', label: 'Автомат' },
    { value: 'Механика', label: 'Механика' }
  ];
  
  const fuelTypes = [
    { value: '', label: 'Любое топливо' },
    { value: 'Бензин', label: 'Бензин' },
    { value: 'Дизель', label: 'Дизель' },
    { value: 'Электро', label: 'Электро' },
    { value: 'Гибрид', label: 'Гибрид' }
  ];
  
  const sortOptions = [
    { value: 'price_asc', label: 'Сначала дешевле' },
    { value: 'price_desc', label: 'Сначала дороже' },
    { value: 'rating_desc', label: 'По рейтингу' },
    { value: 'year_desc', label: 'Новее' }
  ];
  
  return (
    <div className="bg-gray-50 py-10 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Поиск автомобилей</h1>
        
        {/* Форма поиска */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} initialValues={{
            startDate: filters.startDate,
            endDate: filters.endDate,
            location: filters.location,
            category: filters.category
          }} />
        </div>
        
        {/* Основной контент */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Фильтры - для десктопа */}
          <div className="hidden lg:block w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center">
              <FiFilter className="mr-2" />
              Фильтры
            </h2>
            
            <div className="space-y-4">
              {/* Марка */}
              <div>
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                  Марка
                </label>
                <select
                  id="brand"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {brands.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Категория */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Коробка передач */}
              <div>
                <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">
                  Коробка передач
                </label>
                <select
                  id="transmission"
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {transmissions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Тип топлива */}
              <div>
                <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                  Тип топлива
                </label>
                <select
                  id="fuelType"
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  {fuelTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Минимальное количество мест */}
              <div>
                <label htmlFor="minSeats" className="block text-sm font-medium text-gray-700 mb-1">
                  Мин. количество мест
                </label>
                <input
                  type="number"
                  id="minSeats"
                  name="minSeats"
                  min="2"
                  max="9"
                  value={filters.minSeats}
                  onChange={handleFilterChange}
                  className="input w-full"
                  placeholder="Например, 4"
                />
              </div>
              
              {/* Максимальная цена */}
              <div>
                <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                  Макс. цена в день (₽)
                </label>
                <input
                  type="number"
                  id="maxPrice"
                  name="maxPrice"
                  min="0"
                  step="100"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="input w-full"
                  placeholder="Например, 3000"
                />
              </div>
              
              {/* Радиус поиска (если указано местоположение) */}
              {filters.latitude && filters.longitude && (
                <div>
                  <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                    Радиус поиска (км)
                  </label>
                  <input
                    type="range"
                    id="radius"
                    name="radius"
                    min="1"
                    max="20"
                    value={filters.radius}
                    onChange={handleFilterChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 км</span>
                    <span>{filters.radius} км</span>
                    <span>20 км</span>
                  </div>
                </div>
              )}
              
              {/* Кнопки применения/сброса фильтров */}
              <div className="pt-4 flex space-x-2">
                <button
                  type="button"
                  onClick={applyFilters}
                  className="btn btn-primary flex-1"
                >
                  Применить
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-outline flex-1"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>
          
          {/* Основной контент - список автомобилей */}
          <div className="flex-1">
            {/* Панель управления */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Локация */}
                {filters.location && (
                  <div className="flex items-center text-gray-600">
                    <FiMapPin className="mr-1" />
                    <span>{filters.location}</span>
                    {filters.radius && (
                      <span className="ml-1 text-sm">(радиус: {filters.radius} км)</span>
                    )}
                  </div>
                )}
                
                {/* Мета-информация */}
                <div className="flex flex-1 justify-between md:justify-end items-center gap-4">
                  {/* Кнопка фильтров для мобильных */}
                  <button
                    className="lg:hidden inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <FiFilter className="mr-2" />
                    Фильтры
                  </button>
                  
                  {/* Количество найденных автомобилей */}
                  <div className="text-gray-600">
                    Найдено: <span className="font-medium">{totalCars}</span>
                  </div>
                  
                  {/* Сортировка */}
                  <div className="flex items-center">
                    <FiSliders className="mr-2 text-gray-500" />
                    <select
                      name="sort"
                      value={filters.sort}
                      onChange={handleFilterChange}
                      className="input"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Переключатель вида */}
                  <div className="flex border rounded-md">
                    <button
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
                      onClick={() => toggleViewMode('grid')}
                      title="Сетка"
                    >
                      <FiGrid />
                    </button>
                    <button
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600'}`}
                      onClick={() => toggleViewMode('list')}
                      title="Список"
                    >
                      <FiList />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Мобильная панель фильтров */}
            {showFilters && (
              <div className="lg:hidden filter-panel fixed inset-0 bg-white z-50 overflow-auto p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Фильтры</h2>
                  <button
                    className="text-gray-500 p-2"
                    onClick={() => setShowFilters(false)}
                  >
                    <FiX size={24} />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {/* Такие же фильтры, как и в десктопной версии */}
                  {/* Марка */}
                  <div>
                    <label htmlFor="mobile-brand" className="block text-sm font-medium text-gray-700 mb-1">
                      Марка
                    </label>
                    <select
                      id="mobile-brand"
                      name="brand"
                      value={filters.brand}
                      onChange={handleFilterChange}
                      className="input w-full"
                    >
                      {brands.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Категория */}
                  <div>
                    <label htmlFor="mobile-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Категория
                    </label>
                    <select
                      id="mobile-category"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="input w-full"
                    >
                      {categories.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* КПП */}
                  <div>
                    <label htmlFor="mobile-transmission" className="block text-sm font-medium text-gray-700 mb-1">
                      Коробка передач
                    </label>
                    <select
                      id="mobile-transmission"
                      name="transmission"
                      value={filters.transmission}
                      onChange={handleFilterChange}
                      className="input w-full"
                    >
                      {transmissions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Тип топлива */}
                  <div>
                    <label htmlFor="mobile-fuelType" className="block text-sm font-medium text-gray-700 mb-1">
                      Тип топлива
                    </label>
                    <select
                      id="mobile-fuelType"
                      name="fuelType"
                      value={filters.fuelType}
                      onChange={handleFilterChange}
                      className="input w-full"
                    >
                      {fuelTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Минимальное количество мест */}
                  <div>
                    <label htmlFor="mobile-minSeats" className="block text-sm font-medium text-gray-700 mb-1">
                      Мин. количество мест
                    </label>
                    <input
                      type="number"
                      id="mobile-minSeats"
                      name="minSeats"
                      min="2"
                      max="9"
                      value={filters.minSeats}
                      onChange={handleFilterChange}
                      className="input w-full"
                      placeholder="Например, 4"
                    />
                  </div>
                  
                  {/* Максимальная цена */}
                  <div>
                    <label htmlFor="mobile-maxPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Макс. цена в день (₽)
                    </label>
                    <input
                      type="number"
                      id="mobile-maxPrice"
                      name="maxPrice"
                      min="0"
                      step="100"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      className="input w-full"
                      placeholder="Например, 3000"
                    />
                  </div>
                  
                  {/* Радиус поиска (если указано местоположение) */}
                  {filters.latitude && filters.longitude && (
                    <div>
                      <label htmlFor="mobile-radius" className="block text-sm font-medium text-gray-700 mb-1">
                        Радиус поиска (км)
                      </label>
                      <input
                        type="range"
                        id="mobile-radius"
                        name="radius"
                        min="1"
                        max="20"
                        value={filters.radius}
                        onChange={handleFilterChange}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1 км</span>
                        <span>{filters.radius} км</span>
                        <span>20 км</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Кнопки применения/сброса фильтров */}
                <div className="mt-6 flex space-x-2">
                  <button
                    type="button"
                    onClick={applyFilters}
                    className="btn btn-primary flex-1"
                  >
                    Применить
                  </button>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="btn btn-outline flex-1"
                  >
                    Сбросить
                  </button>
                </div>
              </div>
            )}
            
            {/* Вывод ошибки */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 relative">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FiX className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                {error.includes('Ошибка на сервере') && (
                  <ServerErrorNotification 
                    error="Проблема с сервером. Наши технические специалисты уже работают над решением проблемы." 
                    onClose={() => {}}
                  />
                )}
              </div>
            )}
            
            {/* Индикатор загрузки */}
            {loading ? (
              <div className="flex justify-center my-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : (
              <>
                {/* Результаты поиска */}
                {cars.length > 0 ? (
                  <div className={viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                    : "space-y-4"
                  }>
                    {cars.map((car, index) => (
                      <div key={car.id} className="car-container">
                        {viewMode === 'grid' ? (
                          <CarCard car={car} index={index} />
                        ) : (
                          // Список
                          <div className="bg-white rounded-lg shadow-md p-4 flex">
                            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
                              <img 
                                src={car.imageUrl || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop'} 
                                alt={`${car.brand} ${car.model}`} 
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop'; }}
                              />
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between mb-2">
                                <h3 className="text-lg font-bold">{car.brand} {car.model}</h3>
                                <div className="text-sm font-medium text-green-600">от {car.hourlyRate} ₽/час</div>
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {car.year} г., {car.transmission}, {car.fuelType}, {car.seats} мест
                              </div>
                              {car.distance && (
                                <div className="text-sm text-gray-600 mb-2">
                                  Расстояние: {car.distance} км
                                </div>
                              )}
                              <div className="mt-2">
                                <a href={`/cars/${car.id}`} className="btn btn-outline btn-sm">
                                  Подробнее
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoDataAvailable 
                    message="Автомобили не найдены" 
                    description="Попробуйте изменить параметры поиска или сбросить фильтры."
                    onRetry={resetFilters}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCarsPage;
