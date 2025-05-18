import api from './axios';

// Import real services and APIs
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
  statisticsService,
  // Import API aliases
  authAPI,
  userAPI,
  carAPI,
  rentalPlanAPI,
  bookingAPI,
  paymentAPI,
  reviewAPI,
  promotionAPI,
  locationAPI,
  statisticsAPI
} from './services';

// Import mock services during development (uncomment if needed)
// import {
//   authService,
//   userService,
//   carService,
//   rentalPlanService,
//   bookingService,
//   paymentService,
//   reviewService,
//   promotionService,
//   locationService,
//   statisticsService
// } from './mock-services';

export {
  api,
  authService,
  userService,
  carService,
  rentalPlanService,
  bookingService,
  paymentService,
  reviewService,
  promotionService,
  locationService,
  statisticsService,
  // Export API aliases directly
  authAPI,
  userAPI,
  carAPI,
  rentalPlanAPI,
  bookingAPI,
  paymentAPI,
  reviewAPI,
  promotionAPI,
  locationAPI,
  statisticsAPI
};
