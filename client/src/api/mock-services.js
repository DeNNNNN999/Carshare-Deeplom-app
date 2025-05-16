import api from './axios';

// Mock API responses for development without a backend

// Helper function to simulate API calls
const mockApiCall = (data, delay = 500, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject({ response: { data: { message: 'Ошибка сервера (моковая)' } } });
      } else {
        resolve({ data });
      }
    }, delay);
  });
};

// Mock users
const mockUsers = [
  {
    id: 1,
    email: 'admin@carshare.com',
    firstName: 'Админ',
    lastName: 'Администратор',
    phone: '+7 (999) 123-45-67',
    birthDate: '1990-01-01',
    licenseNumber: 'AB123456',
    licenseIssueDate: '2015-05-10',
    licenseExpiryDate: '2025-05-10',
    role: 'admin',
    isVerified: true,
    status: 'active',
    createdAt: '2023-01-01T10:00:00Z',
    updatedAt: '2023-01-01T10:00:00Z'
  },
  {
    id: 2,
    email: 'user@carshare.com',
    firstName: 'Иван',
    lastName: 'Петров',
    phone: '+7 (999) 987-65-43',
    birthDate: '1995-05-15',
    licenseNumber: 'CD789012',
    licenseIssueDate: '2018-03-20',
    licenseExpiryDate: '2028-03-20',
    role: 'client',
    isVerified: true,
    status: 'active',
    createdAt: '2023-02-15T14:30:00Z',
    updatedAt: '2023-02-15T14:30:00Z'
  },
  {
    id: 3,
    email: 'manager@carshare.com',
    firstName: 'Мария',
    lastName: 'Сидорова',
    phone: '+7 (999) 555-55-55',
    birthDate: '1992-07-20',
    licenseNumber: 'EF456789',
    licenseIssueDate: '2016-08-15',
    licenseExpiryDate: '2026-08-15',
    role: 'manager',
    isVerified: true,
    status: 'active',
    createdAt: '2023-03-10T09:00:00Z',
    updatedAt: '2023-03-10T09:00:00Z'
  }
];

// Mock cars
const mockCars = [
  {
    id: 1,
    model: 'Camry',
    brand: 'Toyota',
    year: 2022,
    registrationNumber: 'A123BC',
    color: 'Белый',
    fuelType: 'Бензин',
    transmission: 'Автомат',
    category: 'Седан',
    seats: 5,
    dailyRate: 3500,
    hourlyRate: 350,
    minuteRate: 7,
    status: 'available',
    mileage: 15000,
    imageUrl: 'https://example.com/toyota-camry.jpg',
    location: 'Москва, ул. Тверская, 1',
    createdAt: '2023-01-10T12:00:00Z',
    updatedAt: '2023-01-10T12:00:00Z',
    averageRating: '4.8'
  },
  {
    id: 2,
    model: 'X5',
    brand: 'BMW',
    year: 2021,
    registrationNumber: 'B456CD',
    color: 'Черный',
    fuelType: 'Дизель',
    transmission: 'Автомат',
    category: 'SUV',
    seats: 5,
    dailyRate: 5500,
    hourlyRate: 550,
    minuteRate: 10,
    status: 'available',
    mileage: 20000,
    imageUrl: 'https://example.com/bmw-x5.jpg',
    location: 'Москва, Кутузовский проспект, 32',
    createdAt: '2023-02-05T14:00:00Z',
    updatedAt: '2023-02-05T14:00:00Z'
  },
  {
    id: 3,
    model: 'Model 3',
    brand: 'Tesla',
    year: 2023,
    registrationNumber: 'C789DE',
    color: 'Красный',
    fuelType: 'Электро',
    transmission: 'Автомат',
    category: 'Седан',
    seats: 5,
    dailyRate: 4500,
    hourlyRate: 450,
    minuteRate: 9,
    status: 'available',
    mileage: 10000,
    imageUrl: 'https://example.com/tesla-model3.jpg',
    location: 'Москва, Ленинградский проспект, 15',
    createdAt: '2023-03-12T10:00:00Z',
    updatedAt: '2023-03-12T10:00:00Z'
  }
];

// Mock rental plans
const mockRentalPlans = [
  {
    id: 1,
    name: 'Почасовой',
    description: 'Идеально для коротких поездок по городу',
    durationType: 'hour',
    basePrice: 0,
    pricePerUnit: 350,
    minDuration: 1,
    maxDuration: 12,
    discountPercent: 0,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Дневной',
    description: 'Оптимальный вариант для поездок на 1-3 дня',
    durationType: 'day',
    basePrice: 0,
    pricePerUnit: 3500,
    minDuration: 1,
    maxDuration: 3,
    discountPercent: 0,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 3,
    name: 'Недельный',
    description: 'Выгодный тариф для длительных поездок от 4 до 7 дней',
    durationType: 'day',
    basePrice: 0,
    pricePerUnit: 3000,
    minDuration: 4,
    maxDuration: 7,
    discountPercent: 15,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  },
  {
    id: 4,
    name: 'Месячный',
    description: 'Максимально выгодный тариф для долгосрочной аренды от 30 дней',
    durationType: 'day',
    basePrice: 0,
    pricePerUnit: 2500,
    minDuration: 30,
    maxDuration: 90,
    discountPercent: 30,
    isActive: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
];

// Mock bookings
const mockBookings = [
  {
    id: 1,
    userId: 2,
    carId: 1,
    rentalPlanId: 2,
    startDate: '2023-05-10T10:00:00Z',
    endDate: '2023-05-12T10:00:00Z',
    status: 'completed',
    totalCost: 7000,
    initialMileage: 15000,
    finalMileage: 15300,
    createdAt: '2023-05-09T14:30:00Z',
    updatedAt: '2023-05-12T10:30:00Z',
    car: mockCars[0],
    rentalPlan: mockRentalPlans[1]
  },
  {
    id: 2,
    userId: 2,
    carId: 2,
    rentalPlanId: 3,
    startDate: '2023-06-05T12:00:00Z',
    endDate: '2023-06-09T12:00:00Z',
    status: 'completed',
    totalCost: 15600,
    initialMileage: 20000,
    finalMileage: 20800,
    createdAt: '2023-06-02T16:45:00Z',
    updatedAt: '2023-06-09T12:15:00Z',
    car: mockCars[1],
    rentalPlan: mockRentalPlans[2]
  },
  {
    id: 3,
    userId: 2,
    carId: 3,
    rentalPlanId: 1,
    startDate: '2023-06-20T14:00:00Z',
    endDate: '2023-06-20T20:00:00Z',
    status: 'completed',
    totalCost: 2700,
    initialMileage: 10000,
    finalMileage: 10150,
    createdAt: '2023-06-20T13:30:00Z',
    updatedAt: '2023-06-20T20:15:00Z',
    car: mockCars[2],
    rentalPlan: mockRentalPlans[0]
  },
  {
    id: 4,
    userId: 2,
    carId: 1,
    rentalPlanId: 2,
    startDate: '2023-07-01T09:00:00Z',
    endDate: '2023-07-03T09:00:00Z',
    status: 'active',
    totalCost: 7000,
    initialMileage: 15300,
    finalMileage: null,
    createdAt: '2023-06-28T11:20:00Z',
    updatedAt: '2023-07-01T09:15:00Z',
    car: mockCars[0],
    rentalPlan: mockRentalPlans[1]
  }
];

// Mock payments
const mockPayments = [
  {
    id: 1,
    bookingId: 1,
    userId: 2,
    amount: 7000,
    paymentMethod: 'Банковская карта',
    transactionId: 'txn_123456',
    status: 'completed',
    paymentDate: '2023-05-09T14:35:00Z',
    createdAt: '2023-05-09T14:35:00Z',
    updatedAt: '2023-05-09T14:35:00Z'
  },
  {
    id: 2,
    bookingId: 2,
    userId: 2,
    amount: 15600,
    paymentMethod: 'Банковская карта',
    transactionId: 'txn_234567',
    status: 'completed',
    paymentDate: '2023-06-02T16:50:00Z',
    createdAt: '2023-06-02T16:50:00Z',
    updatedAt: '2023-06-02T16:50:00Z'
  },
  {
    id: 3,
    bookingId: 3,
    userId: 2,
    amount: 2700,
    paymentMethod: 'Банковская карта',
    transactionId: 'txn_345678',
    status: 'completed',
    paymentDate: '2023-06-20T13:40:00Z',
    createdAt: '2023-06-20T13:40:00Z',
    updatedAt: '2023-06-20T13:40:00Z'
  },
  {
    id: 4,
    bookingId: 4,
    userId: 2,
    amount: 7000,
    paymentMethod: 'Банковская карта',
    transactionId: 'txn_456789',
    status: 'completed',
    paymentDate: '2023-06-28T11:25:00Z',
    createdAt: '2023-06-28T11:25:00Z',
    updatedAt: '2023-06-28T11:25:00Z'
  }
];

// Mock reviews
const mockReviews = [
  {
    id: 1,
    userId: 2,
    carId: 1,
    bookingId: 1,
    rating: 5,
    comment: 'Отличный автомобиль, всё работает идеально. Буду арендовать еще.',
    createdAt: '2023-05-12T15:30:00Z',
    updatedAt: '2023-05-12T15:30:00Z',
    car: mockCars[0]
  },
  {
    id: 2,
    userId: 2,
    carId: 2,
    bookingId: 2,
    rating: 4,
    comment: 'Хороший автомобиль, но был немного грязный внутри.',
    createdAt: '2023-06-09T14:20:00Z',
    updatedAt: '2023-06-09T14:20:00Z',
    car: mockCars[1]
  },
  {
    id: 3,
    userId: 2,
    carId: 3,
    bookingId: 3,
    rating: 5,
    comment: 'Превосходная Tesla! Очень понравилось управление и динамика.',
    createdAt: '2023-06-20T21:45:00Z',
    updatedAt: '2023-06-20T21:45:00Z',
    car: mockCars[2]
  }
];

// Модифицируем оригинальные сервисы и добавляем мок-функции
// Сервис для работы с аутентификацией
export const authService = {
  // Регистрация пользователя
  register: (userData) => {
    console.log('Mock register', userData);
    return mockApiCall({
      message: 'Регистрация успешна. Проверьте вашу почту для подтверждения аккаунта.'
    });
  },
  
  // Авторизация пользователя
  login: (credentials) => {
    console.log('Mock login', credentials);
    // Проверяем учетные данные (для демо)
    if (credentials.email === 'admin@carshare.com' && credentials.password === 'password') {
      return mockApiCall({
        token: 'admin_token',
        user: mockUsers[0]
      });
    } else if (credentials.email === 'user@carshare.com' && credentials.password === 'password') {
      return mockApiCall({
        token: 'user_token',
        user: mockUsers[1]
      });
    } else if (credentials.email === 'manager@carshare.com' && credentials.password === 'password') {
      return mockApiCall({
        token: 'manager_token',
        user: mockUsers[2]
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Выход из системы
  logout: () => {
    console.log('Mock logout');
    return mockApiCall({ message: 'Вы успешно вышли из системы' });
  },
  
  // Проверка токена и получение данных пользователя
  checkAuth: () => {
    console.log('Mock checkAuth');
    const token = localStorage.getItem('token');
    if (token) {
      // Для демо возвращаем пользователя в зависимости от роли
      if (token === 'admin_token') {
        return mockApiCall({
          token: 'admin_token',
          user: mockUsers[0]
        });
      } else if (token === 'manager_token') {
        return mockApiCall({
          token: 'manager_token',
          user: mockUsers[2]
        });
      } else {
        return mockApiCall({
          token: 'user_token',
          user: mockUsers[1]
        });
      }
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Запрос на сброс пароля
  forgotPassword: (email) => {
    console.log('Mock forgotPassword', email);
    return mockApiCall({
      message: 'Инструкции по сбросу пароля отправлены на вашу почту'
    });
  },
  
  // Сброс пароля
  resetPassword: (token, password) => {
    console.log('Mock resetPassword', token, password);
    return mockApiCall({
      message: 'Пароль успешно изменен'
    });
  },
  
  // Верификация email
  verifyEmail: (token) => {
    console.log('Mock verifyEmail', token);
    return mockApiCall({
      message: 'Email успешно подтвержден'
    });
  },
};

// Сервис для работы с пользователями
export const userService = {
  // Получение профиля пользователя
  getProfile: () => {
    console.log('Mock getProfile');
    return mockApiCall({
      user: mockUsers[1]
    });
  },
  
  // Обновление профиля пользователя
  updateProfile: (profileData) => {
    console.log('Mock updateProfile', profileData);
    return mockApiCall({
      user: { ...mockUsers[1], ...profileData }
    });
  },
  
  // Загрузка документов
  uploadDocuments: (formData) => {
    console.log('Mock uploadDocuments');
    return mockApiCall({
      message: 'Документы успешно загружены'
    });
  },
  
  // Получение документов пользователя
  getDocuments: () => {
    console.log('Mock getDocuments');
    return mockApiCall({
      documents: [
        {
          id: 1,
          userId: 2,
          type: 'passport',
          fileUrl: 'https://example.com/passport.jpg',
          status: 'verified',
          createdAt: '2023-02-15T15:00:00Z',
          updatedAt: '2023-02-16T10:30:00Z'
        },
        {
          id: 2,
          userId: 2,
          type: 'license',
          fileUrl: 'https://example.com/license.jpg',
          status: 'verified',
          createdAt: '2023-02-15T15:01:00Z',
          updatedAt: '2023-02-16T10:31:00Z'
        }
      ]
    });
  },
  
  // [ADMIN] Получение списка всех пользователей
  getAllUsers: (params) => {
    console.log('Mock getAllUsers', params);
    return mockApiCall({
      users: mockUsers,
      total: mockUsers.length
    });
  },
  
  // [ADMIN] Получение информации о пользователе
  getUserById: (id) => {
    console.log('Mock getUserById', id);
    const user = mockUsers.find(u => u.id === parseInt(id));
    if (user) {
      return mockApiCall({ user });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Обновление пользователя
  updateUser: (id, userData) => {
    console.log('Mock updateUser', id, userData);
    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
    if (userIndex !== -1) {
      return mockApiCall({
        user: { ...mockUsers[userIndex], ...userData }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Обновление статуса пользователя
  updateUserStatus: (id, status) => {
    console.log('Mock updateUserStatus', id, status);
    const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
    if (userIndex !== -1) {
      return mockApiCall({
        user: { ...mockUsers[userIndex], status }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
};

// Сервис для работы с автомобилями
export const carService = {
  // Получение списка автомобилей с фильтрацией
  getCars: (params, options = {}) => {
    console.log('Mock getCars', params, options);
    
    // Добавляем задержку для симуляции реального API
    const delayTime = 300;
    
    // Копия массива автомобилей для фильтрации
    let filteredCars = [...mockCars];
    
    // Применяем фильтры, если они есть
    if (params) {
      if (params.brand) {
        filteredCars = filteredCars.filter(car => car.brand === params.brand);
      }
      
      if (params.category) {
        filteredCars = filteredCars.filter(car => car.category === params.category);
      }
      
      if (params.transmission) {
        filteredCars = filteredCars.filter(car => car.transmission === params.transmission);
      }
      
      if (params.fuelType) {
        filteredCars = filteredCars.filter(car => car.fuelType === params.fuelType);
      }
      
      if (params.minSeats) {
        filteredCars = filteredCars.filter(car => car.seats >= parseInt(params.minSeats));
      }
      
      if (params.maxPrice) {
        filteredCars = filteredCars.filter(car => car.dailyRate <= parseFloat(params.maxPrice));
      }
    }
    
    // Добавляем рейтинги для всех автомобилей
    filteredCars = filteredCars.map(car => ({
      ...car,
      averageRating: car.averageRating || (Math.random() * 2 + 3).toFixed(1) // Случайный рейтинг от 3 до 5 если не задан
    }));
    
    return mockApiCall({
      cars: filteredCars,
      count: filteredCars.length
    }, delayTime);
  },
  
  // Получение информации об автомобиле
  getCarById: (id) => {
    console.log('Mock getCarById', id);
    const car = mockCars.find(c => c.id === parseInt(id));
    if (car) {
      return mockApiCall({ car });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Создание нового автомобиля
  createCar: (carData) => {
    console.log('Mock createCar', carData);
    return mockApiCall({
      car: { id: mockCars.length + 1, ...carData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  },
  
  // [ADMIN] Обновление автомобиля
  updateCar: (id, carData) => {
    console.log('Mock updateCar', id, carData);
    const carIndex = mockCars.findIndex(c => c.id === parseInt(id));
    if (carIndex !== -1) {
      return mockApiCall({
        car: { ...mockCars[carIndex], ...carData, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Обновление статуса автомобиля
  updateCarStatus: (id, status) => {
    console.log('Mock updateCarStatus', id, status);
    const carIndex = mockCars.findIndex(c => c.id === parseInt(id));
    if (carIndex !== -1) {
      return mockApiCall({
        car: { ...mockCars[carIndex], status, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Получение истории аренды автомобиля
  getCarRentalHistory: (id) => {
    console.log('Mock getCarRentalHistory', id);
    const bookings = mockBookings.filter(b => b.carId === parseInt(id));
    return mockApiCall({
      bookings,
      total: bookings.length
    });
  },
};

// Сервис для работы с тарифными планами
export const rentalPlanService = {
  // Получение списка тарифных планов
  getRentalPlans: () => {
    console.log('Mock getRentalPlans');
    return mockApiCall({
      rentalPlans: mockRentalPlans,
      total: mockRentalPlans.length
    });
  },
  
  // Получение информации о тарифном плане
  getRentalPlanById: (id) => {
    console.log('Mock getRentalPlanById', id);
    const plan = mockRentalPlans.find(p => p.id === parseInt(id));
    if (plan) {
      return mockApiCall({ rentalPlan: plan });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Создание нового тарифного плана
  createRentalPlan: (planData) => {
    console.log('Mock createRentalPlan', planData);
    return mockApiCall({
      rentalPlan: { id: mockRentalPlans.length + 1, ...planData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  },
  
  // [ADMIN] Обновление тарифного плана
  updateRentalPlan: (id, planData) => {
    console.log('Mock updateRentalPlan', id, planData);
    const planIndex = mockRentalPlans.findIndex(p => p.id === parseInt(id));
    if (planIndex !== -1) {
      return mockApiCall({
        rentalPlan: { ...mockRentalPlans[planIndex], ...planData, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Обновление статуса тарифного плана
  updateRentalPlanStatus: (id, isActive) => {
    console.log('Mock updateRentalPlanStatus', id, isActive);
    const planIndex = mockRentalPlans.findIndex(p => p.id === parseInt(id));
    if (planIndex !== -1) {
      return mockApiCall({
        rentalPlan: { ...mockRentalPlans[planIndex], isActive, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
};

// Сервис для работы с бронированиями
export const bookingService = {
  // Создание бронирования
  createBooking: (bookingData) => {
    console.log('Mock createBooking', bookingData);
    return mockApiCall({
      booking: { id: mockBookings.length + 1, ...bookingData, status: 'pending', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
    });
  },
  
  // Получение списка бронирований пользователя
  getUserBookings: (params) => {
    console.log('Mock getUserBookings', params);
    const userBookings = mockBookings.filter(b => b.userId === 2);
    return mockApiCall({
      bookings: userBookings,
      total: userBookings.length
    });
  },
  
  // Получение информации о бронировании
  getBookingById: (id) => {
    console.log('Mock getBookingById', id);
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (booking) {
      return mockApiCall(booking);
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Отмена бронирования
  cancelBooking: (id) => {
    console.log('Mock cancelBooking', id);
    const bookingIndex = mockBookings.findIndex(b => b.id === parseInt(id));
    if (bookingIndex !== -1) {
      return mockApiCall({
        booking: { ...mockBookings[bookingIndex], status: 'cancelled', updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Продление аренды
  extendBooking: (id, newEndDate) => {
    console.log('Mock extendBooking', id, newEndDate);
    const bookingIndex = mockBookings.findIndex(b => b.id === parseInt(id));
    if (bookingIndex !== -1) {
      return mockApiCall({
        booking: { ...mockBookings[bookingIndex], endDate: newEndDate, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Досрочное завершение аренды
  completeBookingEarly: (id, finalMileage) => {
    console.log('Mock completeBookingEarly', id, finalMileage);
    const bookingIndex = mockBookings.findIndex(b => b.id === parseInt(id));
    if (bookingIndex !== -1) {
      return mockApiCall({
        booking: { 
          ...mockBookings[bookingIndex], 
          status: 'completed', 
          endDate: new Date().toISOString(),
          finalMileage: finalMileage || mockBookings[bookingIndex].initialMileage + 100,
          updatedAt: new Date().toISOString() 
        }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN/MANAGER] Подтверждение бронирования
  confirmBooking: (id) => {
    console.log('Mock confirmBooking', id);
    const bookingIndex = mockBookings.findIndex(b => b.id === parseInt(id));
    if (bookingIndex !== -1) {
      return mockApiCall({
        booking: { ...mockBookings[bookingIndex], status: 'confirmed', updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN/MANAGER] Получение всех бронирований
  getAllBookings: (params) => {
    console.log('Mock getAllBookings', params);
    
    // Создаем упрощенные бронирования без вложенных объектов
    const simplifiedBookings = mockBookings.map(booking => ({
      id: booking.id,
      userId: booking.userId,
      carId: booking.carId,
      rentalPlanId: booking.rentalPlanId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: booking.status,
      totalCost: booking.totalCost,
      initialMileage: booking.initialMileage,
      finalMileage: booking.finalMileage,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }));
    
    return mockApiCall({
      bookings: simplifiedBookings
    });
  },
};

// Сервис для работы с платежами
export const paymentService = {
  // Создание платежа
  createPayment: (paymentData) => {
    console.log('Mock createPayment', paymentData);
    return mockApiCall({
      payment: { 
        id: mockPayments.length + 1, 
        ...paymentData, 
        status: 'completed', 
        paymentDate: new Date().toISOString(),
        transactionId: `txn_${Math.random().toString(36).substring(2, 10)}`,
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      }
    });
  },
  
  // Получение списка платежей пользователя
  getUserPayments: () => {
    console.log('Mock getUserPayments');
    const userPayments = mockPayments.filter(p => p.userId === 2);
    return mockApiCall({
      payments: userPayments,
      total: userPayments.length
    });
  },
  
  // Получение информации о платеже
  getPaymentById: (id) => {
    console.log('Mock getPaymentById', id);
    const payment = mockPayments.find(p => p.id === parseInt(id));
    if (payment) {
      return mockApiCall({ payment });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // Обновление статуса платежа
  updatePaymentStatus: (id, status) => {
    console.log('Mock updatePaymentStatus', id, status);
    const paymentIndex = mockPayments.findIndex(p => p.id === parseInt(id));
    if (paymentIndex !== -1) {
      return mockApiCall({
        payment: { ...mockPayments[paymentIndex], status, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Возврат средств
  refundPayment: (id, reason) => {
    console.log('Mock refundPayment', id, reason);
    const paymentIndex = mockPayments.findIndex(p => p.id === parseInt(id));
    if (paymentIndex !== -1) {
      return mockApiCall({
        payment: { ...mockPayments[paymentIndex], status: 'refunded', updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Получение всех платежей
  getAllPayments: (params) => {
    console.log('Mock getAllPayments', params);
    return mockApiCall({
      payments: mockPayments,
      total: mockPayments.length
    });
  },
};

// Сервис для работы с отзывами
export const reviewService = {
  // Создание отзыва
  createReview: (reviewData) => {
    console.log('Mock createReview', reviewData);
    return mockApiCall({
      review: { 
        id: mockReviews.length + 1, 
        userId: 2, 
        ...reviewData, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString(),
        car: mockCars.find(c => c.id === reviewData.carId)
      }
    });
  },
  
  // Получение отзывов об автомобиле
  getCarReviews: (carId) => {
    console.log('Mock getCarReviews', carId);
    const carReviews = mockReviews.filter(r => r.carId === parseInt(carId));
    return mockApiCall({
      reviews: carReviews,
      total: carReviews.length
    });
  },
  
  // Получение отзывов пользователя
  getUserReviews: () => {
    console.log('Mock getUserReviews');
    const userReviews = mockReviews.filter(r => r.userId === 2);
    return mockApiCall({
      reviews: userReviews,
      total: userReviews.length
    });
  },
  
  // [ADMIN] Модерация отзыва
  moderateReview: (id, moderationData) => {
    console.log('Mock moderateReview', id, moderationData);
    const reviewIndex = mockReviews.findIndex(r => r.id === parseInt(id));
    if (reviewIndex !== -1) {
      return mockApiCall({
        review: { ...mockReviews[reviewIndex], ...moderationData, updatedAt: new Date().toISOString() }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
};

// Сервис для работы с акциями
export const promotionService = {
  // Получение активных акций
  getActivePromotions: () => {
    console.log('Mock getActivePromotions');
    return mockApiCall({
      promotions: [
        {
          id: 1,
          name: 'Скидка 10% на первое бронирование',
          description: 'Скидка 10% для новых пользователей',
          discountPercent: 10,
          startDate: '2023-01-01T00:00:00Z',
          endDate: '2023-12-31T23:59:59Z',
          code: 'WELCOME10',
          isActive: true,
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Летняя акция',
          description: 'Скидка 15% на аренду на более чем 7 дней в летний период',
          discountPercent: 15,
          startDate: '2023-06-01T00:00:00Z',
          endDate: '2023-08-31T23:59:59Z',
          code: 'SUMMER15',
          isActive: true,
          createdAt: '2023-05-15T00:00:00Z',
          updatedAt: '2023-05-15T00:00:00Z'
        }
      ],
      total: 2
    });
  },
  
  // Применение промокода
  applyPromoCode: (code) => {
    console.log('Mock applyPromoCode', code);
    if (code === 'WELCOME10') {
      return mockApiCall({
        promotion: {
          id: 1,
          name: 'Скидка 10% на первое бронирование',
          discountPercent: 10
        }
      });
    } else if (code === 'SUMMER15') {
      return mockApiCall({
        promotion: {
          id: 2,
          name: 'Летняя акция',
          discountPercent: 15
        }
      });
    } else {
      return mockApiCall(null, 500, true);
    }
  },
  
  // [ADMIN] Создание акции
  createPromotion: (promotionData) => {
    console.log('Mock createPromotion', promotionData);
    return mockApiCall({
      promotion: { 
        id: 3, 
        ...promotionData, 
        isActive: true, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      }
    });
  },
  
  // [ADMIN] Обновление акции
  updatePromotion: (id, promotionData) => {
    console.log('Mock updatePromotion', id, promotionData);
    return mockApiCall({
      promotion: { 
        id: parseInt(id), 
        ...promotionData, 
        updatedAt: new Date().toISOString() 
      }
    });
  },
  
  // [ADMIN] Обновление статуса акции
  updatePromotionStatus: (id, isActive) => {
    console.log('Mock updatePromotionStatus', id, isActive);
    return mockApiCall({
      promotion: { 
        id: parseInt(id), 
        isActive, 
        updatedAt: new Date().toISOString() 
      }
    });
  },
};

// Сервис для работы с местоположением
export const locationService = {
  // Получение автомобилей в заданном радиусе
  getCarsInRadius: (params, options = {}) => {
    console.log('Mock getCarsInRadius', params, options);
    
    // Добавляем задержку для симуляции реального API
    const delayTime = 300;
    
    // Фильтруем только доступные автомобили
    let availableCars = mockCars.filter(c => c.status === 'available');
    
    // Добавляем рейтинг и расстояние для каждого автомобиля
    availableCars = availableCars.map(car => ({
      ...car,
      averageRating: car.averageRating || (Math.random() * 2 + 3).toFixed(1), // Случайный рейтинг от 3 до 5 если не задан
      distance: (Math.random() * params.radius).toFixed(1) // Случайное расстояние в пределах заданного радиуса
    }));
    
    return mockApiCall({
      cars: availableCars,
      count: availableCars.length
    }, delayTime);
  },
};

// Сервис для работы со статистикой
export const statisticsService = {
  // [ADMIN] Получение общей статистики
  getOverviewStats: () => {
    console.log('Mock getOverviewStats');
    return mockApiCall({
      totalBookings: 312,
      activeBookings: 28,
      bookingsByStatus: {
        active: 28,
        completed: 264,
        pending: 12,
        cancelled: 8
      },
      totalUsers: 126,
      totalCars: 45
    });
  },
  
  // [ADMIN] Получение статистики по автомобилям
  getCarStats: (params) => {
    console.log('Mock getCarStats', params);
    return mockApiCall({
      totalCars: 45,
      carsByStatus: {
        available: 32,
        rented: 10,
        maintenance: 3
      },
      popularCars: [
        { id: 1, brand: 'Toyota', model: 'Camry', totalBookings: 48 },
        { id: 2, brand: 'BMW', model: 'X5', totalBookings: 42 },
        { id: 3, brand: 'Tesla', model: 'Model 3', totalBookings: 37 },
        { id: 4, brand: 'Mercedes', model: 'E-Class', totalBookings: 31 },
        { id: 5, brand: 'Audi', model: 'A4', totalBookings: 28 }
      ]
    });
  },
  
  // [ADMIN] Получение статистики по пользователям
  getUserStats: (params) => {
    console.log('Mock getUserStats', params);
    return mockApiCall({
      totalUsers: 126,
      activeUsers: 98,
      verifiedUsers: 112,
      userGrowth: 8.2,
      usersByMonth: [
        { month: 'Янв', count: 10 },
        { month: 'Фев', count: 15 },
        { month: 'Мар', count: 18 },
        { month: 'Апр', count: 12 },
        { month: 'Май', count: 14 },
        { month: 'Июн', count: 20 }
      ]
    });
  },
  
  // [ADMIN] Получение статистики по доходам
  getRevenueStats: (params) => {
    console.log('Mock getRevenueStats', params);
    return mockApiCall({
      totalRevenue: 1258400,
      revenueGrowth: 12.5,
      monthlyRevenue: [
        { month: 'Янв', revenue: 89600 },
        { month: 'Фев', revenue: 76400 },
        { month: 'Мар', revenue: 102300 },
        { month: 'Апр', revenue: 94500 },
        { month: 'Май', revenue: 108700 },
        { month: 'Июн', revenue: 125600 }
      ],
      revenueByPlan: [
        { plan: 'Почасовой', revenue: 156200 },
        { plan: 'Дневной', revenue: 487300 },
        { plan: 'Недельный', revenue: 314600 },
        { plan: 'Месячный', revenue: 300300 }
      ]
    });
  },
  
  // [ADMIN] Получение статистики по долгосрочной аренде
  getLongTermStats: (params) => {
    console.log('Mock getLongTermStats', params);
    return mockApiCall({
      totalLongTermBookings: 42,
      averageDuration: 35.8,
      popularCars: [
        { id: 2, brand: 'BMW', model: 'X5', totalBookings: 12 },
        { id: 1, brand: 'Toyota', model: 'Camry', totalBookings: 10 },
        { id: 5, brand: 'Audi', model: 'A4', totalBookings: 8 }
      ],
      totalRevenue: 624000
    });
  },
};

// Экспорт всех сервисов
export default {
  auth: authService,
  user: userService,
  car: carService,
  rentalPlan: rentalPlanService,
  booking: bookingService,
  payment: paymentService,
  review: reviewService,
  promotion: promotionService,
  location: locationService,
  statistics: statisticsService,
};
