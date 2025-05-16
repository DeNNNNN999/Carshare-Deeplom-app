import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { carService } from '../../api/services';
import { FiTruck, FiEdit, FiTrash, FiPlus, FiFilter, FiX, FiSearch, FiMapPin } from 'react-icons/fi';
import moment from 'moment';

const CarManagementPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    category: '',
    status: '',
    transmission: '',
    fuelType: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchCars();
  }, [pagination.page, pagination.limit]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Подготовка параметров для запроса
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await carService.getCars(params);
      setCars(response.data.cars || []);
      setPagination(prev => ({ ...prev, total: response.data.total || 0 }));
    } catch (err) {
      setError('Не удалось загрузить автомобили. Пожалуйста, попробуйте позже.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    fetchCars();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      brand: '',
      category: '',
      status: '',
      transmission: '',
      fuelType: ''
    });
    setPagination(prev => ({ ...prev, page: 1 })); // Сбрасываем на первую страницу
    setTimeout(() => {
      fetchCars();
    }, 0);
  };

  const handleStatusChange = async (carId, newStatus) => {
    if (!window.confirm(`Вы уверены, что хотите изменить статус автомобиля на "${newStatus}"?`)) {
      return;
    }
    
    try {
      await carService.updateCarStatus(carId, newStatus);
      // Обновляем список автомобилей
      fetchCars();
    } catch (err) {
      alert(err.response?.data?.message || 'Не удалось изменить статус автомобиля');
    }
  };

  const handleDeleteCar = (carId) => {
    alert('Функция удаления автомобиля пока не реализована');
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Доступен</span>;
      case 'rented':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">В аренде</span>;
      case 'maintenance':
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">На ТО</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const handleNextPage = () => {
    if (pagination.page * pagination.limit < pagination.total) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Управление автопарком</h1>
        <div className="flex space-x-2">
          <Link to="/admin/cars/new" className="btn btn-primary flex items-center">
            <FiPlus className="mr-2" />
            Добавить автомобиль
          </Link>
          <button 
            className="btn btn-outline flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter className="mr-2" />
            Фильтры
          </button>
        </div>
      </div>
      
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Фильтры</h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          
          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Поиск
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Марка, модель, гос. номер"
                    className="input w-full pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Марка
                </label>
                <input
                  type="text"
                  name="brand"
                  value={filters.brand}
                  onChange={handleFilterChange}
                  placeholder="Toyota, BMW, и т.д."
                  className="input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все категории</option>
                  <option value="Седан">Седан</option>
                  <option value="SUV">SUV</option>
                  <option value="Хэтчбек">Хэтчбек</option>
                  <option value="Минивен">Минивен</option>
                  <option value="Кабриолет">Кабриолет</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Статус
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Все статусы</option>
                  <option value="available">Доступен</option>
                  <option value="rented">В аренде</option>
                  <option value="maintenance">На ТО</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Трансмиссия
                </label>
                <select
                  name="transmission"
                  value={filters.transmission}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Любая</option>
                  <option value="Автомат">Автомат</option>
                  <option value="Механика">Механика</option>
                  <option value="Робот">Робот</option>
                  <option value="Вариатор">Вариатор</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Тип топлива
                </label>
                <select
                  name="fuelType"
                  value={filters.fuelType}
                  onChange={handleFilterChange}
                  className="input w-full"
                >
                  <option value="">Любой</option>
                  <option value="Бензин">Бензин</option>
                  <option value="Дизель">Дизель</option>
                  <option value="Электро">Электро</option>
                  <option value="Гибрид">Гибрид</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end mt-4 space-x-2">
              <button 
                type="button" 
                onClick={resetFilters}
                className="btn btn-outline"
              >
                Сбросить
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
              >
                Применить
              </button>
            </div>
          </form>
        </div>
      )}
      
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
          {cars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cars.map((car) => (
                <div key={car.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {car.imageUrl ? (
                      <img 
                        src={car.imageUrl} 
                        alt={`${car.brand} ${car.model}`} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiTruck className="h-20 w-20 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">
                        {car.brand} {car.model} ({car.year})
                      </h3>
                      {renderStatusBadge(car.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      {car.registrationNumber} • {car.color} • {car.transmission} • {car.fuelType}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FiMapPin className="mr-1" />
                      {car.location || 'Местоположение не указано'}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                        Категория: {car.category}
                      </div>
                      <div className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                        Мест: {car.seats}
                      </div>
                      <div className="text-sm px-2 py-1 bg-gray-100 rounded-full">
                        Пробег: {car.mileage} км
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm mb-4">
                      <div>
                        <div className="text-gray-600">Тариф в день:</div>
                        <div className="font-medium">{Number(car.dailyRate).toFixed(2)} ₽</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Тариф в час:</div>
                        <div className="font-medium">{Number(car.hourlyRate).toFixed(2)} ₽</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Тариф в минуту:</div>
                        <div className="font-medium">{Number(car.minuteRate).toFixed(2)} ₽</div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-3 border-t">
                      <Link 
                        to={`/admin/cars/${car.id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <FiEdit className="mr-1" />
                        Редактировать
                      </Link>
                      
                      <div className="flex space-x-2">
                        {car.status === 'available' ? (
                          <button
                            onClick={() => handleStatusChange(car.id, 'maintenance')}
                            className="btn btn-warning btn-sm"
                          >
                            На ТО
                          </button>
                        ) : car.status === 'maintenance' ? (
                          <button
                            onClick={() => handleStatusChange(car.id, 'available')}
                            className="btn btn-success btn-sm"
                          >
                            Доступен
                          </button>
                        ) : null}
                        
                        <Link 
                          to={`/admin/cars/${car.id}/history`}
                          className="btn btn-primary btn-sm"
                        >
                          История
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <div className="text-gray-500 mb-4">Автомобили не найдены</div>
              {Object.values(filters).some(v => v !== '') && (
                <button
                  onClick={resetFilters}
                  className="btn btn-primary"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          )}
          
          {/* Пагинация */}
          {cars.length > 0 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Показано <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> из <span className="font-medium">{pagination.total}</span> автомобилей
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrevPage}
                  disabled={pagination.page === 1}
                  className={`btn btn-sm ${pagination.page === 1 ? 'btn-disabled' : 'btn-outline'}`}
                >
                  Назад
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={pagination.page * pagination.limit >= pagination.total}
                  className={`btn btn-sm ${pagination.page * pagination.limit >= pagination.total ? 'btn-disabled' : 'btn-outline'}`}
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CarManagementPage;
