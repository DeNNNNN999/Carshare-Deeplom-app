const { User, Car, Booking, RentalPlan, Payment } = require('./models');
const sequelize = require('./config/database');

const createTestPayments = async () => {
  try {
    // Проверка количества платежей в базе данных
    const paymentsCount = await Payment.count();
    if (paymentsCount > 0) {
      console.log('Тестовые платежи уже существуют');
      return;
    }

    // Получаем админа
    const admin = await User.findOne({ where: { email: 'admin@carshare.com' } });
    if (!admin) {
      console.log('Администратор не найден');
      return;
    }

    // Создаем тестовое бронирование для админа, если еще нет
    const bookingsCount = await Booking.count({ where: { userId: admin.id } });
    
    let booking;
    
    if (bookingsCount === 0) {
      // Находим машину и тарифный план
      const car = await Car.findOne();
      const plan = await RentalPlan.findOne();
      
      if (!car || !plan) {
        console.log('Не найдены автомобили или тарифные планы');
        return;
      }
      
      // Создаем бронирование
      booking = await Booking.create({
        userId: admin.id,
        carId: car.id,
        rentalPlanId: plan.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Через неделю
        status: 'completed',
        totalCost: 5000,
        initialMileage: car.mileage,
        finalMileage: car.mileage + 100
      });
    } else {
      // Используем существующее бронирование
      booking = await Booking.findOne({ where: { userId: admin.id } });
    }
    
    // Создаем тестовый платеж
    await Payment.create({
      bookingId: booking.id,
      userId: admin.id,
      amount: booking.totalCost,
      paymentMethod: 'Банковская карта',
      transactionId: `TR_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'completed',
      paymentDate: new Date()
    });
    
    console.log('Тестовые платежи успешно созданы');
  } catch (error) {
    console.error('Ошибка при создании тестовых платежей:', error);
  }
};

module.exports = {
  createTestPayments
};
