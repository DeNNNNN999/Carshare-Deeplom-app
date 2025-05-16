import api from './axios';

// Import mock services during development
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
} from './mock-services';

// Uncomment this to use real services in production
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
// } from './services';

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
  statisticsService
};
