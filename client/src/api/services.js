import api from './axios';

// Сервис для работы с аутентификацией
export const authService = {
  // Регистрация пользователя
  register: (userData) => {
    return api.post('/auth/register', userData);
  },
  
  // Авторизация пользователя
  login: (credentials) => {
    return api.post('/auth/login', credentials);
  },
  
  // Выход из системы
  logout: () => {
    return api.post('/auth/logout');
  },
  
  // Проверка токена и получение данных пользователя
  checkAuth: () => {
    return api.post('/auth/refresh-token');
  },
  
  // Запрос на сброс пароля
  forgotPassword: (email) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  // Сброс пароля
  resetPassword: (token, password) => {
    return api.post(`/auth/reset-password/${token}`, { password });
  },
  
  // Верификация email
  verifyEmail: (token) => {
    return api.get(`/auth/verify-email/${token}`);
  },
};

// Сервис для работы с пользователями
export const userService = {
  // Получение профиля пользователя
  getProfile: () => {
    return api.get('/users/profile');
  },
  
  // Обновление профиля пользователя
  updateProfile: (profileData) => {
    return api.put('/users/profile', profileData);
  },
  
  // Загрузка документов
  uploadDocuments: (formData) => {
    return api.post('/users/documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Получение документов пользователя
  getDocuments: () => {
    return api.get('/users/documents');
  },
  
  // [ADMIN] Получение списка всех пользователей
  getAllUsers: (params) => {
    return api.get('/users', { params });
  },
  
  // [ADMIN] Получение информации о пользователе
  getUserById: (id) => {
    return api.get(`/users/${id}`);
  },
  
  // [ADMIN] Обновление пользователя
  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },
  
  // [ADMIN] Обновление статуса пользователя
  updateUserStatus: (id, status) => {
    return api.put(`/users/${id}/status`, { status });
  },
};

// Сервис для работы с автомобилями
export const carService = {
  // Получение списка автомобилей с фильтрацией
  getCars: (params, options = {}) => {
    return api.get('/cars', { params, ...options });
  },
  
  // Получение информации об автомобиле
  getCarById: (id) => {
    return api.get(`/cars/${id}`);
  },
  
  // [ADMIN] Создание нового автомобиля
  createCar: (carData) => {
    return api.post('/cars', carData);
  },
  
  // [ADMIN] Обновление автомобиля
  updateCar: (id, carData) => {
    return api.put(`/cars/${id}`, carData);
  },
  
  // [ADMIN] Обновление статуса автомобиля
  updateCarStatus: (id, status) => {
    return api.put(`/cars/${id}/status`, { status });
  },
  
  // [ADMIN] Получение истории аренды автомобиля
  getCarRentalHistory: (id) => {
    return api.get(`/cars/${id}/history`);
  },
};

// Сервис для работы с тарифными планами
export const rentalPlanService = {
  // Получение списка тарифных планов
  getRentalPlans: () => {
    return api.get('/rental-plans');
  },
  
  // Получение информации о тарифном плане
  getRentalPlanById: (id) => {
    return api.get(`/rental-plans/${id}`);
  },
  
  // [ADMIN] Создание нового тарифного плана
  createRentalPlan: (planData) => {
    return api.post('/rental-plans', planData);
  },
  
  // [ADMIN] Обновление тарифного плана
  updateRentalPlan: (id, planData) => {
    return api.put(`/rental-plans/${id}`, planData);
  },
  
  // [ADMIN] Обновление статуса тарифного плана
  updateRentalPlanStatus: (id, isActive) => {
    return api.put(`/rental-plans/${id}/status`, { isActive });
  },
};

// Сервис для работы с бронированиями
export const bookingService = {
  // Создание бронирования
  createBooking: (bookingData) => {
    return api.post('/bookings', bookingData);
  },
  
  // Получение списка бронирований пользователя
  getUserBookings: (params) => {
    return api.get('/bookings', { params });
  },
  
  // Получение информации о бронировании
  getBookingById: (id) => {
    return api.get(`/bookings/${id}`);
  },
  
  // Отмена бронирования
  cancelBooking: (id) => {
    return api.put(`/bookings/${id}/cancel`);
  },
  
  // Продление аренды
  extendBooking: (id, newEndDate) => {
    return api.put(`/bookings/${id}/extend`, { newEndDate });
  },
  
  // Досрочное завершение аренды
  completeBookingEarly: (id, finalMileage) => {
    return api.put(`/bookings/${id}/complete-early`, { finalMileage });
  },
  
  // [ADMIN/MANAGER] Подтверждение бронирования
  confirmBooking: (id) => {
    return api.put(`/bookings/${id}/confirm`);
  },
  
  // [ADMIN/MANAGER] Получение всех бронирований
  getAllBookings: (params) => {
    // Чтобы предотвратить кеширование добавим текущее время
    return api.get('/bookings/all', { 
      params,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    });
  },
};

// Сервис для работы с платежами
export const paymentService = {
  // Создание платежа
  createPayment: (paymentData) => {
    return api.post('/payments', paymentData);
  },
  
  // Получение списка платежей пользователя
  getUserPayments: () => {
    return api.get('/payments');
  },
  
  // Получение информации о платеже
  getPaymentById: (id) => {
    return api.get(`/payments/${id}`);
  },
  
  // Обновление статуса платежа
  updatePaymentStatus: (id, status) => {
    return api.put(`/payments/${id}/status`, { status });
  },
  
  // [ADMIN] Возврат средств
  refundPayment: (id, reason) => {
    return api.post(`/payments/${id}/refund`, { reason });
  },
  
  // [ADMIN] Получение всех платежей
  getAllPayments: (params) => {
    // Чтобы предотвратить кеширование добавим текущее время
    return api.get('/payments/all', { 
      params,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      } 
    });
  },
};

// Сервис для работы с отзывами
export const reviewService = {
  // Создание отзыва
  createReview: (reviewData) => {
    return api.post('/reviews', reviewData);
  },
  
  // Получение отзывов об автомобиле
  getCarReviews: (carId) => {
    return api.get(`/reviews/car/${carId}`);
  },
  
  // Получение отзывов пользователя
  getUserReviews: () => {
    return api.get('/reviews/user');
  },
  
  // [ADMIN] Модерация отзыва
  moderateReview: (id, moderationData) => {
    return api.put(`/reviews/${id}/moderate`, moderationData);
  },
};

// Сервис для работы с акциями
export const promotionService = {
  // Получение активных акций
  getActivePromotions: () => {
    return api.get('/promotions');
  },
  
  // Применение промокода
  applyPromoCode: (code) => {
    return api.post('/promotions/apply-promo', { code });
  },
  
  // [ADMIN] Создание акции
  createPromotion: (promotionData) => {
    return api.post('/promotions', promotionData);
  },
  
  // [ADMIN] Обновление акции
  updatePromotion: (id, promotionData) => {
    return api.put(`/promotions/${id}`, promotionData);
  },
  
  // [ADMIN] Обновление статуса акции
  updatePromotionStatus: (id, isActive) => {
    return api.put(`/promotions/${id}/status`, { isActive });
  },
};

// Сервис для работы с местоположением
export const locationService = {
  // Получение автомобилей в заданном радиусе
  getCarsInRadius: (params, options = {}) => {
    return api.get('/locations', { params, ...options });
  },
};

// Сервис для работы со статистикой
export const statisticsService = {
  // [ADMIN] Получение общей статистики
  getOverviewStats: () => {
    return api.get('/statistics/overview');
  },
  
  // [ADMIN] Получение статистики по автомобилям
  getCarStats: (params) => {
    return api.get('/statistics/cars', { params });
  },
  
  // [ADMIN] Получение статистики по пользователям
  getUserStats: (params) => {
    return api.get('/statistics/users', { params });
  },
  
  // [ADMIN] Получение статистики по доходам
  getRevenueStats: (params) => {
    return api.get('/statistics/revenue', { params });
  },
  
  // [ADMIN] Получение статистики по долгосрочной аренде
  getLongTermStats: (params) => {
    return api.get('/statistics/long-term', { params });
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
