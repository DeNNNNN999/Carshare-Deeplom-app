// Экспорт сервисов для использования в компонентах
import {
  authService,
  userService,
  carService,
  rentalPlanService,
  bookingService,
  paymentService,
  reviewService,
  promotionService,
  locationService,
  statisticsService
} from './services';

// Экспортируем с именами API для совместимости
export const authAPI = authService;
export const userAPI = userService;
export const carAPI = carService;
export const rentalPlanAPI = rentalPlanService;
export const bookingAPI = bookingService;
export const paymentAPI = paymentService;
export const reviewAPI = reviewService;
export const promotionAPI = promotionService;
export const locationAPI = locationService;
export const statisticsAPI = statisticsService;

// Экспортируем также оригинальные имена
export {
  authService,
  userService,
  carService,
  rentalPlanService,
  bookingService,
  paymentService,
  reviewService,
  promotionService,
  locationService,
  statisticsService
};