const { Booking, Car, User, RentalPlan, Payment, Promotion } = require('../models');
const { pricing, email } = require('../utils');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// Создание бронирования
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { carId, rentalPlanId, startDate, endDate, promoCode } = req.body;

    // Проверка существования автомобиля
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Проверка доступности автомобиля
    if (car.status !== 'available') {
      return res.status(400).json({ message: 'Автомобиль недоступен для аренды' });
    }

    // Проверка существования тарифного плана
    const rentalPlan = await RentalPlan.findByPk(rentalPlanId);
    if (!rentalPlan) {
      return res.status(404).json({ message: 'Тарифный план не найден' });
    }

    // Проверка активности тарифного плана
    if (!rentalPlan.isActive) {
      return res.status(400).json({ message: 'Тарифный план неактивен' });
    }

    // Проверка на перекрытие с другими бронированиями
    const overlappingBookings = await Booking.findAll({
      where: {
        carId,
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        },
        [Op.or]: [
          {
            startDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          },
          {
            endDate: {
              [Op.between]: [new Date(startDate), new Date(endDate)]
            }
          },
          {
            [Op.and]: [
              { startDate: { [Op.lte]: new Date(startDate) } },
              { endDate: { [Op.gte]: new Date(endDate) } }
            ]
          }
        ]
      }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Автомобиль уже забронирован на выбранный период' });
    }

    // Поиск промокода, если он указан
    let promotion = null;
    if (promoCode) {
      promotion = await Promotion.findOne({
        where: {
          code: promoCode,
          isActive: true,
          startDate: { [Op.lte]: new Date() },
          endDate: { [Op.gte]: new Date() },
          [Op.or]: [
            { maxUses: null },
            { usesCount: { [Op.lt]: sequelize.col('maxUses') } }
          ]
        }
      });

      if (!promotion) {
        return res.status(400).json({ message: 'Промокод недействителен или истек срок его действия' });
      }
    }

    // Расчет общей стоимости
    const totalCost = pricing.calculateRentalCost(
      rentalPlan,
      car,
      startDate,
      endDate,
      promotion
    );

    // Создание бронирования
    const booking = await Booking.create({
      userId,
      carId,
      rentalPlanId,
      startDate,
      endDate,
      status: 'pending',
      totalCost,
      initialMileage: car.mileage,
      promoCodeId: promotion ? promotion.id : null,
      discountAmount: promotion ? totalCost * (promotion.discountValue / 100) : 0
    });

    // Увеличение счетчика использования промокода
    if (promotion) {
      promotion.usesCount += 1;
      await promotion.save();
    }

    res.status(201).json({ 
      message: 'Бронирование успешно создано',
      booking
    });
  } catch (error) {
    console.error('Ошибка при создании бронирования:', error);
    res.status(500).json({ message: 'Ошибка при создании бронирования' });
  }
};

// Получение списка бронирований пользователя
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Параметры фильтрации
    const status = req.query.status;
    
    const whereClause = { userId };
    
    if (status) {
      whereClause.status = status;
    }
    
    const bookings = await Booking.findAll({
      where: whereClause,
      include: [
        {
          model: Car,
          attributes: ['id', 'brand', 'model', 'registrationNumber', 'imageUrl']
        },
        {
          model: RentalPlan,
          attributes: ['id', 'name', 'durationType']
        }
      ],
      order: [['startDate', 'DESC']]
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Ошибка при получении списка бронирований:', error);
    res.status(500).json({ message: 'Ошибка при получении списка бронирований' });
  }
};

// Получение информации о конкретном бронировании
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await Booking.findOne({
      where: { 
        id,
        userId 
      },
      include: [
        {
          model: Car,
          attributes: ['id', 'brand', 'model', 'registrationNumber', 'color', 'imageUrl']
        },
        {
          model: RentalPlan,
          attributes: ['id', 'name', 'durationType', 'description']
        },
        {
          model: Payment,
          attributes: ['id', 'amount', 'status', 'paymentMethod', 'paymentDate']
        },
        {
          model: Promotion,
          attributes: ['id', 'name', 'code', 'discountType', 'discountValue']
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error('Ошибка при получении информации о бронировании:', error);
    res.status(500).json({ message: 'Ошибка при получении информации о бронировании' });
  }
};

// Отмена бронирования
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await Booking.findOne({
      where: { 
        id,
        userId 
      }
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка статуса бронирования
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Невозможно отменить это бронирование' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Если был использован промокод, уменьшаем счетчик использования
    if (booking.promoCodeId) {
      const promotion = await Promotion.findByPk(booking.promoCodeId);
      if (promotion) {
        promotion.usesCount = Math.max(0, promotion.usesCount - 1);
        await promotion.save();
      }
    }

    res.status(200).json({ 
      message: 'Бронирование успешно отменено',
      booking: {
        id: booking.id,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Ошибка при отмене бронирования:', error);
    res.status(500).json({ message: 'Ошибка при отмене бронирования' });
  }
};

// Продление аренды
const extendBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { newEndDate } = req.body;
    const userId = req.user.id;
    
    if (!newEndDate) {
      return res.status(400).json({ message: 'Не указана новая дата окончания аренды' });
    }
    
    const booking = await Booking.findOne({
      where: { 
        id,
        userId 
      },
      include: [
        {
          model: Car
        },
        {
          model: RentalPlan
        },
        {
          model: Promotion
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка статуса бронирования
    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Невозможно продлить эту аренду' });
    }

    // Проверка новой даты окончания
    const currentEndDate = new Date(booking.endDate);
    const extendedEndDate = new Date(newEndDate);
    
    if (extendedEndDate <= currentEndDate) {
      return res.status(400).json({ message: 'Новая дата окончания должна быть позже текущей' });
    }

    // Проверка на перекрытие с другими бронированиями
    const overlappingBookings = await Booking.findAll({
      where: {
        carId: booking.carId,
        id: { [Op.ne]: booking.id },
        status: {
          [Op.notIn]: ['cancelled', 'completed']
        },
        startDate: { [Op.lte]: extendedEndDate },
        endDate: { [Op.gte]: currentEndDate }
      }
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Невозможно продлить аренду из-за пересечения с другими бронированиями' });
    }

    // Расчет дополнительной стоимости
    const additionalCost = pricing.calculateRentalCost(
      booking.RentalPlan,
      booking.Car,
      currentEndDate,
      extendedEndDate,
      booking.Promotion
    );

    // Обновление бронирования
    booking.endDate = extendedEndDate;
    booking.totalCost = parseFloat(booking.totalCost) + parseFloat(additionalCost);
    await booking.save();

    res.status(200).json({ 
      message: 'Аренда успешно продлена',
      booking: {
        id: booking.id,
        endDate: booking.endDate,
        totalCost: booking.totalCost,
        additionalCost
      }
    });
  } catch (error) {
    console.error('Ошибка при продлении аренды:', error);
    res.status(500).json({ message: 'Ошибка при продлении аренды' });
  }
};

// Досрочное завершение аренды
const completeBookingEarly = async (req, res) => {
  try {
    const { id } = req.params;
    const { finalMileage } = req.body;
    const userId = req.user.id;
    
    if (!finalMileage) {
      return res.status(400).json({ message: 'Не указан конечный пробег автомобиля' });
    }
    
    const booking = await Booking.findOne({
      where: { 
        id,
        userId 
      },
      include: [
        {
          model: Car
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка статуса бронирования
    if (booking.status !== 'active') {
      return res.status(400).json({ message: 'Невозможно завершить эту аренду' });
    }

    // Проверка пробега
    if (parseInt(finalMileage) < parseInt(booking.initialMileage)) {
      return res.status(400).json({ message: 'Конечный пробег не может быть меньше начального' });
    }

    // Обновление бронирования
    booking.status = 'completed';
    booking.finalMileage = finalMileage;
    booking.endDate = new Date(); // Досрочное завершение на текущую дату
    await booking.save();

    // Обновление пробега автомобиля
    const car = booking.Car;
    car.mileage = finalMileage;
    car.status = 'available';
    await car.save();

    res.status(200).json({ 
      message: 'Аренда успешно завершена',
      booking: {
        id: booking.id,
        status: booking.status,
        endDate: booking.endDate,
        finalMileage: booking.finalMileage
      }
    });
  } catch (error) {
    console.error('Ошибка при завершении аренды:', error);
    res.status(500).json({ message: 'Ошибка при завершении аренды' });
  }
};

// [ADMIN/MANAGER] Подтверждение бронирования
const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByPk(id, {
      include: [
        {
          model: Car
        },
        {
          model: User,
          attributes: ['id', 'email', 'firstName', 'lastName']
        }
      ]
    });
    
    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка статуса бронирования
    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Невозможно подтвердить это бронирование' });
    }

    // Обновление статуса бронирования
    booking.status = 'confirmed';
    await booking.save();

    // Обновление статуса автомобиля
    const car = booking.Car;
    car.status = 'rented';
    await car.save();

    // Отправка email подтверждения
    const user = booking.User;
    await email.sendBookingConfirmationEmail(user.email, booking, car);

    res.status(200).json({ 
      message: 'Бронирование успешно подтверждено',
      booking: {
        id: booking.id,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Ошибка при подтверждении бронирования:', error);
    res.status(500).json({ message: 'Ошибка при подтверждении бронирования' });
  }
};

// [ADMIN/MANAGER] Получение всех бронирований
const getAllBookings = async (req, res) => {
  try {
    // Параметры фильтрации
    const status = req.query.status;
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    console.log("Запрос на получение всех бронирований:", {
      whereClause,
      status: req.query.status,
      role: req.user.role
    });
    
    // Максимально упрощенный запрос без join-ов
    const bookings = await Booking.findAll({
      where: whereClause,
      attributes: ['id', 'userId', 'carId', 'rentalPlanId', 'startDate', 'endDate', 'status', 'totalCost'],
      order: [['createdAt', 'DESC']]
    });

    console.log(`Найдено ${bookings.length} бронирований`);

    res.status(200).json({
      bookings: bookings
    });
  } catch (error) {
    console.error('Ошибка при получении списка всех бронирований:', error);
    res.status(500).json({ message: 'Ошибка при получении списка всех бронирований' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  extendBooking,
  completeBookingEarly,
  confirmBooking,
  getAllBookings
};
