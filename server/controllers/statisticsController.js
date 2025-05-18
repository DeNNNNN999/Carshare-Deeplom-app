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
    const totalCars = await Car.count();
    
    // Получение общего количества бронирований
    const totalBookings = await Booking.count();
    
    // Получение статистики бронирований по статусам
    const bookingsByStatus = await Booking.findAll({
      attributes: [
        'status',
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
      ],
      group: ['status'],
      raw: true
    });

    // Преобразуем результат в объект
    const bookingsStatusObj = {};
    bookingsByStatus.forEach(item => {
      bookingsStatusObj[item.status] = parseInt(item.count);
    });

    // Получение общей суммы платежей
    const totalRevenue = await Payment.sum('amount', {
      where: { status: 'completed' }
    }) || 0;

    const activeBookings = bookingsStatusObj.active || 0;

    res.status(200).json({
      users: {
        total: totalUsers
      },
      cars: {
        total: totalCars
      },
      bookings: {
        total: totalBookings,
        byStatus: bookingsStatusObj,
        active: activeBookings
      },
      payments: {
        netRevenue: totalRevenue
      },
      activeBookings: activeBookings,
      totalBookings: totalBookings
    });
  } catch (error) {
    console.error('Ошибка при получении общей статистики:', error);
    res.status(500).json({ message: 'Ошибка при получении общей статистики' });
  }
};

// [ADMIN] Статистика по автомобилям
const getCarStats = async (req, res) => {
  try {
    // Получение общего количества автомобилей
    const totalCars = await Car.count();
    
    // Получение самых популярных автомобилей по бронированиям
    const popularCars = await Booking.findAll({
      attributes: [
        'carId',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'totalBookings'],
        [Sequelize.fn('SUM', Sequelize.col('totalCost')), 'totalRevenue']
      ],
      include: [{
        model: Car,
        attributes: ['id', 'brand', 'model']
      }],
      group: ['carId', 'Car.id', 'Car.brand', 'Car.model'],
      order: [[Sequelize.literal('totalBookings'), 'DESC']],
      limit: 5,
      raw: true,
      nest: true
    });

    res.status(200).json({
      totalCars: totalCars,
      popularCars: popularCars.map(car => ({
        id: car.Car.id,
        brand: car.Car.brand,
        model: car.Car.model,
        totalBookings: parseInt(car.totalBookings)
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
    // Получение общего количества пользователей
    const totalUsers = await User.count({
      where: { status: 'active' }
    });
    
    // Получение количества новых пользователей за последний месяц
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const newUsersLastMonth = await User.count({
      where: {
        createdAt: {
          [Op.gte]: lastMonth
        }
      }
    });
    
    // Расчет роста пользователей
    const previousMonthUsers = totalUsers - newUsersLastMonth;
    const userGrowth = previousMonthUsers > 0 
      ? ((newUsersLastMonth / previousMonthUsers) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      totalUsers: totalUsers,
      growth: {
        percentage: parseFloat(userGrowth)
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
    // Получение доходов за последние 6 месяцев
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Payment.findAll({
      attributes: [
        [Sequelize.fn('date_trunc', 'month', Sequelize.col('paymentDate')), 'month'],
        [Sequelize.fn('SUM', Sequelize.col('amount')), 'revenue']
      ],
      where: {
        status: 'completed',
        paymentDate: {
          [Op.gte]: sixMonthsAgo
        }
      },
      group: [Sequelize.fn('date_trunc', 'month', Sequelize.col('paymentDate'))],
      order: [[Sequelize.literal('month'), 'ASC']],
      raw: true
    });
    
    // Получение дохода за последний месяц
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const lastMonthRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        paymentDate: {
          [Op.gte]: lastMonth
        }
      }
    }) || 0;
    
    // Получение дохода за предыдущий месяц
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 2);
    
    const previousMonthRevenue = await Payment.sum('amount', {
      where: {
        status: 'completed',
        paymentDate: {
          [Op.gte]: previousMonth,
          [Op.lt]: lastMonth
        }
      }
    }) || 0;
    
    // Расчет роста дохода
    const revenueGrowth = previousMonthRevenue > 0 
      ? ((lastMonthRevenue - previousMonthRevenue) / previousMonthRevenue * 100).toFixed(1)
      : 0;
    
    // Форматирование данных по месяцам
    const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const formattedMonthlyRevenue = monthlyRevenue.map(item => {
      const date = new Date(item.month);
      return {
        month: monthNames[date.getMonth()],
        revenue: parseFloat(item.revenue) || 0
      };
    });

    res.status(200).json({
      totalRevenue: lastMonthRevenue,
      growth: {
        percentage: parseFloat(revenueGrowth)
      },
      monthlyStats: formattedMonthlyRevenue
    });
  } catch (error) {
    console.error('Ошибка при получении статистики по доходам:', error);
    res.status(500).json({ message: 'Ошибка при получении статистики по доходам' });
  }
};

// [ADMIN] Статистика по долгосрочной аренде
const getLongTermStats = async (req, res) => {
  try {
    // Получение статистики по долгосрочным арендам (более 7 дней)
    const longTermBookings = await Booking.count({
      where: {
        [Op.and]: [
          Sequelize.literal("(\"endDate\" - \"startDate\") > INTERVAL '7 days'"),
          { status: 'completed' }
        ]
      }
    });
    
    const totalCompletedBookings = await Booking.count({
      where: { status: 'completed' }
    });
    
    const longTermPercentage = totalCompletedBookings > 0
      ? ((longTermBookings / totalCompletedBookings) * 100).toFixed(1)
      : 0;

    res.status(200).json({
      longTermBookings: longTermBookings,
      totalBookings: totalCompletedBookings,
      percentage: parseFloat(longTermPercentage)
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