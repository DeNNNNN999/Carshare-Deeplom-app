const { User, Car, Booking, Payment, RentalPlan } = require('../models');
const { Op, Sequelize } = require('sequelize');

// [ADMIN] Получение общей статистики
const getOverviewStats = async (req, res) => {
  try {
    // Получение общего количества пользователей
    const totalUsers = await User.count({
      where: { status: 'active' }
    });

    // Получение общего количества автомобилей
    const carsStats = await Car.count({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Получение общего количества бронирований
    const bookingsStats = await Booking.count({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Получение общей суммы платежей
    const paymentsStats = await Payment.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalAmount'],
        'status'
      ],
      where: {
        status: {
          [Op.in]: ['completed', 'refunded']
        }
      },
      group: ['status']
    });

    // Получение количества активных тарифных планов
    const totalRentalPlans = await RentalPlan.count({
      where: { isActive: true }
    });

    // Обработка и форматирование данных
    const carsByStatus = {};
    carsStats.forEach(stat => {
      carsByStatus[stat.status] = stat.get('count');
    });

    const bookingsByStatus = {};
    bookingsStats.forEach(stat => {
      bookingsByStatus[stat.status] = stat.get('count');
    });

    const paymentsByStatus = {};
    paymentsStats.forEach(stat => {
      paymentsByStatus[stat.status] = parseFloat(stat.get('totalAmount')) || 0;
    });

    res.status(200).json({
      users: {
        total: totalUsers
      },
      cars: {
        total: Object.values(carsByStatus).reduce((sum, count) => sum + count, 0),
        byStatus: carsByStatus
      },
      bookings: {
        total: Object.values(bookingsByStatus).reduce((sum, count) => sum + count, 0),
        byStatus: bookingsByStatus
      },
      payments: {
        totalCompleted: paymentsByStatus.completed || 0,
        totalRefunded: paymentsByStatus.refunded || 0,
        netRevenue: (paymentsByStatus.completed || 0) - (paymentsByStatus.refunded || 0)
      },
      rentalPlans: {
        total: totalRentalPlans
      }
    });
  } catch (error) {
    console.error('Ошибка при получении общей статистики:', error);
    res.status(500).json({ message: 'Ошибка при получении общей статистики' });
  }
};

// [ADMIN] Статистика по автомобилям
const getCarStats = async (req, res) => {
  try {
    // Параметры фильтрации
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Получение самых популярных моделей автомобилей
    const popularCars = await Booking.findAll({
      attributes: [
        'carId',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingsCount'],
        [Sequelize.fn('SUM', Sequelize.col('totalCost')), 'totalRevenue']
      ],
      include: [
        {
          model: Car,
          attributes: ['id', 'brand', 'model', 'category', 'registrationNumber']
        }
      ],
      where: dateFilter,
      group: ['carId', 'Car.id'],
      order: [[Sequelize.literal('bookingsCount'), 'DESC']],
      limit: 10
    });

    // Получение статистики по категориям автомобилей
    const categoryStats = await Booking.findAll({
      attributes: [
        [Sequelize.col('Car.category'), 'category'],
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingsCount'],
        [Sequelize.fn('SUM', Sequelize.col('totalCost')), 'totalRevenue']
      ],
      include: [
        {
          model: Car,
          attributes: []
        }
      ],
      where: dateFilter,
      group: ['Car.category'],
      order: [[Sequelize.literal('bookingsCount'), 'DESC']]
    });

    // Получение статистики по использованию автомобилей (% времени в аренде)
    const carUtilization = await Car.findAll({
      attributes: [
        'id', 'brand', 'model', 'registrationNumber',
        [Sequelize.literal(`
          (SELECT COALESCE(SUM(
            EXTRACT(EPOCH FROM ("endDate" - "startDate")) / 86400
          ), 0) 
          FROM "Bookings" 
          WHERE "Bookings"."carId" = "Car"."id"
          ${startDate && endDate ? 
            `AND "Bookings"."startDate" >= '${startDate}' 
             AND "Bookings"."endDate" <= '${endDate}'` 
             : ''}
          AND "Bookings"."status" IN ('completed', 'active'))`
        ), 'totalRentalDays'],
        [Sequelize.literal(`
          (SELECT COUNT(*) 
          FROM "Bookings" 
          WHERE "Bookings"."carId" = "Car"."id"
          ${startDate && endDate ? 
            `AND "Bookings"."startDate" >= '${startDate}' 
             AND "Bookings"."endDate" <= '${endDate}'` 
             : ''})`
        ), 'totalBookings']
      ],
      order: [[Sequelize.literal('totalRentalDays'), 'DESC']],
      limit: 10
    });

    res.status(200).json({
      popularCars: popularCars.map(car => ({
        id: car.Car.id,
        brand: car.Car.brand,
        model: car.Car.model,
        registrationNumber: car.Car.registrationNumber,
        bookingsCount: parseInt(car.get('bookingsCount')),
        totalRevenue: parseFloat(car.get('totalRevenue')) || 0
      })),
      categoryStats: categoryStats.map(stat => ({
        category: stat.get('category'),
        bookingsCount: parseInt(stat.get('bookingsCount')),
        totalRevenue: parseFloat(stat.get('totalRevenue')) || 0
      })),
      utilization: carUtilization.map(car => ({
        id: car.id,
        brand: car.brand,
        model: car.model,
        registrationNumber: car.registrationNumber,
        totalRentalDays: parseFloat(car.get('totalRentalDays')) || 0,
        totalBookings: parseInt(car.get('totalBookings')) || 0
      }))
    });
  } catch (error) {
    console.error('Ошибка при получении статистики по автомобилям:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики по автомобилям' });
  }
};

// [ADMIN] Статистика по пользователям
const getUserStats = async (req, res) => {
  try {
    // Параметры фильтрации
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Получение самых активных пользователей
    const activeUsers = await Booking.findAll({
      attributes: [
        'userId',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingsCount'],
        [Sequelize.fn('SUM', Sequelize.col('totalCost')), 'totalSpent']
      ],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ],
      where: dateFilter,
      group: ['userId', 'User.id'],
      order: [[Sequelize.literal('bookingsCount'), 'DESC']],
      limit: 10
    });

    // Получение статистики регистраций пользователей по месяцам
    const userRegistrations = await User.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      where: dateFilter,
      group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt'))],
      order: [[Sequelize.literal('month'), 'ASC']]
    });

    // Получение данных по конверсии (% пользователей, которые сделали хотя бы одно бронирование)
    const totalUsers = await User.count({
      where: {
        ...dateFilter,
        status: 'active'
      }
    });

    const usersWithBookings = await Booking.count({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('userId'))), 'count']
      ],
      where: dateFilter,
      raw: true
    });

    const conversionRate = totalUsers > 0 
      ? ((usersWithBookings[0]?.count || 0) / totalUsers) * 100 
      : 0;

    res.status(200).json({
      activeUsers: activeUsers.map(user => ({
        id: user.User.id,
        firstName: user.User.firstName,
        lastName: user.User.lastName,
        email: user.User.email,
        bookingsCount: parseInt(user.get('bookingsCount')),
        totalSpent: parseFloat(user.get('totalSpent')) || 0
      })),
      registrationsByMonth: userRegistrations.map(stat => ({
        month: stat.get('month'),
        count: parseInt(stat.get('count'))
      })),
      conversionStats: {
        totalUsers,
        usersWithBookings: usersWithBookings[0]?.count || 0,
        conversionRate: parseFloat(conversionRate.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Ошибка при получении статистики по пользователям:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики по пользователям' });
  }
};

// [ADMIN] Статистика по доходам
const getRevenueStats = async (req, res) => {
  try {
    // Параметры фильтрации
    const { startDate, endDate, groupBy = 'month' } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.paymentDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Группировка по дате
    let dateFormat;
    if (groupBy === 'day') {
      dateFormat = 'day';
    } else if (groupBy === 'week') {
      dateFormat = 'week';
    } else if (groupBy === 'year') {
      dateFormat = 'year';
    } else {
      dateFormat = 'month';
    }

    // Получение статистики доходов по периодам
    const revenueByPeriod = await Payment.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', dateFormat, Sequelize.col('paymentDate')), 'period'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalRevenue'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'paymentsCount']
      ],
      where: {
        ...dateFilter,
        status: 'completed'
      },
      group: [Sequelize.fn('date_trunc', dateFormat, Sequelize.col('paymentDate'))],
      order: [[Sequelize.literal('period'), 'ASC']]
    });

    // Получение статистики доходов по типам тарифных планов
    const revenueByPlanType = await Payment.findAll({
      attributes: [
        [Sequelize.col('Booking.RentalPlan.durationType'), 'planType'],
        [Sequelize.fn('SUM', Sequelize.col('Payment.amount')), 'totalRevenue'],
        [Sequelize.fn('COUNT', Sequelize.col('Payment.id')), 'paymentsCount']
      ],
      include: [
        {
          model: Booking,
          attributes: [],
          include: [
            {
              model: RentalPlan,
              attributes: []
            }
          ]
        }
      ],
      where: {
        ...dateFilter,
        status: 'completed'
      },
      group: ['Booking.RentalPlan.durationType'],
      order: [[Sequelize.literal('totalRevenue'), 'DESC']]
    });

    // Получение средней стоимости аренды
    const averageBookingCost = await Booking.findAll({
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('totalCost')), 'avgCost']
      ],
      where: dateFilter
    });

    res.status(200).json({
      revenueByPeriod: revenueByPeriod.map(stat => ({
        period: stat.get('period'),
        totalRevenue: parseFloat(stat.get('totalRevenue')) || 0,
        paymentsCount: parseInt(stat.get('paymentsCount'))
      })),
      revenueByPlanType: revenueByPlanType.map(stat => ({
        planType: stat.get('planType'),
        totalRevenue: parseFloat(stat.get('totalRevenue')) || 0,
        paymentsCount: parseInt(stat.get('paymentsCount'))
      })),
      averageStats: {
        averageBookingCost: parseFloat(averageBookingCost[0]?.get('avgCost')) || 0
      }
    });
  } catch (error) {
    console.error('Ошибка при получении статистики по доходам:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики по доходам' });
  }
};

// [ADMIN] Статистика по долгосрочной аренде
const getLongTermStats = async (req, res) => {
  try {
    // Параметры фильтрации
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.startDate = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    // Долгосрочной считаем аренду на неделю и более
    const longTermBookings = await Booking.findAll({
      attributes: [
        [Sequelize.literal(`
          EXTRACT(EPOCH FROM ("endDate" - "startDate")) / 86400
        `), 'durationDays'],
        'id', 'carId', 'userId', 'totalCost', 'startDate', 'endDate', 'status'
      ],
      include: [
        {
          model: Car,
          attributes: ['id', 'brand', 'model']
        },
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: RentalPlan,
          attributes: ['id', 'name', 'durationType']
        }
      ],
      where: {
        ...dateFilter,
        [Op.or]: [
          {
            '$RentalPlan.durationType$': {
              [Op.in]: ['week', 'month']
            }
          },
          Sequelize.literal(`
            EXTRACT(EPOCH FROM ("endDate" - "startDate")) / 86400 >= 7
          `)
        ]
      },
      order: [[Sequelize.literal('durationDays'), 'DESC']]
    });

    // Соотношение долгосрочной и краткосрочной аренды
    const longTermCount = longTermBookings.length;
    
    const totalBookingsCount = await Booking.count({
      where: dateFilter
    });
    
    const longTermPercentage = totalBookingsCount > 0 
      ? (longTermCount / totalBookingsCount) * 100 
      : 0;

    // Средняя длительность долгосрочной аренды
    const totalDurationDays = longTermBookings.reduce(
      (sum, booking) => sum + parseFloat(booking.get('durationDays') || 0), 
      0
    );
    
    const averageDuration = longTermCount > 0 
      ? totalDurationDays / longTermCount 
      : 0;

    // Доход от долгосрочной аренды
    const totalRevenue = longTermBookings.reduce(
      (sum, booking) => sum + parseFloat(booking.totalCost || 0), 
      0
    );

    // Популярные модели для долгосрочной аренды
    const carStats = {};
    longTermBookings.forEach(booking => {
      const carKey = `${booking.Car.brand} ${booking.Car.model}`;
      if (!carStats[carKey]) {
        carStats[carKey] = {
          count: 0,
          revenue: 0
        };
      }
      carStats[carKey].count += 1;
      carStats[carKey].revenue += parseFloat(booking.totalCost || 0);
    });

    const popularCars = Object.entries(carStats)
      .map(([car, stats]) => ({
        car,
        bookingsCount: stats.count,
        totalRevenue: stats.revenue
      }))
      .sort((a, b) => b.bookingsCount - a.bookingsCount);

    res.status(200).json({
      longTermStats: {
        totalBookings: longTermCount,
        percentage: parseFloat(longTermPercentage.toFixed(2)),
        averageDuration: parseFloat(averageDuration.toFixed(1)),
        totalRevenue
      },
      popularCars: popularCars.slice(0, 10),
      bookings: longTermBookings.map(booking => ({
        id: booking.id,
        car: `${booking.Car.brand} ${booking.Car.model}`,
        user: `${booking.User.firstName} ${booking.User.lastName}`,
        rentalPlan: booking.RentalPlan.name,
        startDate: booking.startDate,
        endDate: booking.endDate,
        durationDays: parseFloat(booking.get('durationDays')).toFixed(1),
        status: booking.status,
        totalCost: booking.totalCost
      }))
    });
  } catch (error) {
    console.error('Ошибка при получении статистики по долгосрочной аренде:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики по долгосрочной аренде' });
  }
};

module.exports = {
  getOverviewStats,
  getCarStats,
  getUserStats,
  getRevenueStats,
  getLongTermStats
};
