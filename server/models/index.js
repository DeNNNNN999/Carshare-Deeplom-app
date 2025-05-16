const User = require('./User');
const Car = require('./Car');
const Booking = require('./Booking');
const RentalPlan = require('./RentalPlan');
const Payment = require('./Payment');
const Review = require('./Review');
const Promotion = require('./Promotion');
const CarLocation = require('./CarLocation');
const UserDocument = require('./UserDocument');

// Определение отношений между моделями

// User - Booking (один ко многим)
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

// Car - Booking (один ко многим)
Car.hasMany(Booking, { foreignKey: 'carId' });
Booking.belongsTo(Car, { foreignKey: 'carId' });

// RentalPlan - Booking (один ко многим)
RentalPlan.hasMany(Booking, { foreignKey: 'rentalPlanId' });
Booking.belongsTo(RentalPlan, { foreignKey: 'rentalPlanId' });

// Booking - Payment (один ко многим)
Booking.hasMany(Payment, { foreignKey: 'bookingId' });
Payment.belongsTo(Booking, { foreignKey: 'bookingId' });

// User - Payment (один ко многим)
User.hasMany(Payment, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'userId' });

// User - Review (один ко многим)
User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

// Car - Review (один ко многим)
Car.hasMany(Review, { foreignKey: 'carId' });
Review.belongsTo(Car, { foreignKey: 'carId' });

// Booking - Review (один к одному)
Booking.hasOne(Review, { foreignKey: 'bookingId' });
Review.belongsTo(Booking, { foreignKey: 'bookingId' });

// Car - CarLocation (один к одному)
Car.hasOne(CarLocation, { foreignKey: 'carId' });
CarLocation.belongsTo(Car, { foreignKey: 'carId' });

// User - UserDocument (один ко многим)
User.hasMany(UserDocument, { foreignKey: 'userId' });
UserDocument.belongsTo(User, { foreignKey: 'userId' });

// Promotion - Booking (один ко многим)
Promotion.hasMany(Booking, { foreignKey: 'promoCodeId' });
Booking.belongsTo(Promotion, { foreignKey: 'promoCodeId' });

module.exports = {
  User,
  Car,
  Booking,
  RentalPlan,
  Payment,
  Review,
  Promotion,
  CarLocation,
  UserDocument
};
