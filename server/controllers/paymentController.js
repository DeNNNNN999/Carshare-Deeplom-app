const { Payment, Booking, User, Car, RentalPlan } = require('../models');
const { Op } = require('sequelize');

// В реальном приложении здесь была бы интеграция с платежной системой
// Например, Stripe, PayPal и т.д.

// Создание платежа
const createPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, paymentMethod } = req.body;

    // Проверка существования бронирования
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено' });
    }

    // Проверка статуса бронирования
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({ message: 'Невозможно создать платеж для этого бронирования' });
    }

    // Проверка, есть ли уже оплаченный платеж для этого бронирования
    const existingPayment = await Payment.findOne({
      where: {
        bookingId,
        status: 'completed'
      }
    });

    if (existingPayment) {
      return res.status(400).json({ message: 'Это бронирование уже оплачено' });
    }

    // В реальном приложении здесь был бы запрос к платежной системе
    // Для создания платежа и получения transactionId

    // Создание платежа (симуляция)
    const transactionId = `TR_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const payment = await Payment.create({
      bookingId,
      userId,
      amount: booking.totalCost,
      paymentMethod,
      transactionId,
      status: 'pending',
      paymentDate: new Date()
    });

    // В реальном приложении здесь пользователь был бы перенаправлен
    // на страницу оплаты платежной системы

    res.status(201).json({ 
      message: 'Платеж успешно создан',
      payment,
      // redirectUrl: `https://payment-system.com/pay/${transactionId}`
    });
  } catch (error) {
    console.error('Ошибка при создании платежа:', error);
    res.status(500).json({ message: 'Ошибка при создании платежа' });
  }
};

// Получение списка платежей пользователя
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const payments = await Payment.findAll({
      where: { userId },
      include: [
        {
          model: Booking,
          attributes: ['id', 'startDate', 'endDate', 'status'],
          include: [
            {
              model: Car,
              attributes: ['id', 'brand', 'model', 'registrationNumber']
            }
          ]
        }
      ],
      order: [['paymentDate', 'DESC']]
    });

    res.status(200).json({ payments });
  } catch (error) {
    console.error('Ошибка при получении списка платежей:', error);
    res.status(500).json({ message: 'Ошибка при получении списка платежей' });
  }
};

// Получение информации о конкретном платеже
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const payment = await Payment.findOne({
      where: { 
        id,
        userId 
      },
      include: [
        {
          model: Booking,
          attributes: ['id', 'startDate', 'endDate', 'status', 'totalCost'],
          include: [
            {
              model: Car,
              attributes: ['id', 'brand', 'model', 'registrationNumber']
            },
            {
              model: RentalPlan,
              attributes: ['id', 'name', 'durationType']
            }
          ]
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Платеж не найден' });
    }

    res.status(200).json({ payment });
  } catch (error) {
    console.error('Ошибка при получении информации о платеже:', error);
    res.status(500).json({ message: 'Ошибка при получении информации о платеже' });
  }
};

// Обработка webhook от платежной системы
const handlePaymentWebhook = async (req, res) => {
  try {
    // В реальном приложении здесь была бы проверка подписи webhook
    // для убеждения, что запрос действительно пришел от платежной системы
    
    const { transactionId, status, amount } = req.body;
    
    // Поиск платежа по transactionId
    const payment = await Payment.findOne({
      where: { transactionId },
      include: [
        {
          model: Booking
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Платеж не найден' });
    }

    // Обновление статуса платежа
    payment.status = status;
    
    // Если платеж успешен, обновляем статус бронирования
    if (status === 'completed') {
      const booking = payment.Booking;
      
      if (booking.status === 'pending') {
        booking.status = 'confirmed';
        await booking.save();
      }
    }
    
    await payment.save();

    // Платежные системы обычно ожидают статус 200 для подтверждения получения webhook
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке webhook платежа:', error);
    res.status(500).json({ message: 'Ошибка при обработке webhook платежа' });
  }
};

// [ADMIN] Возврат средств
const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Booking
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Платеж не найден' });
    }

    // Проверка статуса платежа
    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Возврат возможен только для завершенных платежей' });
    }

    // В реальном приложении здесь был бы запрос к платежной системе
    // для выполнения возврата средств

    // Обновление статуса платежа
    payment.status = 'refunded';
    await payment.save();

    // Обновление статуса бронирования
    const booking = payment.Booking;
    booking.status = 'cancelled';
    booking.notes = reason || 'Возврат средств';
    await booking.save();

    res.status(200).json({ 
      message: 'Возврат средств успешно выполнен',
      payment: {
        id: payment.id,
        amount: payment.amount,
        status: payment.status
      }
    });
  } catch (error) {
    console.error('Ошибка при возврате средств:', error);
    res.status(500).json({ message: 'Ошибка при возврате средств' });
  }
};

// [ADMIN] Получение всех платежей
const getAllPayments = async (req, res) => {
  try {
    // Параметры фильтрации
    const status = req.query.status;
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
  
    console.log("Запрос на получение всех платежей:", {
      whereClause,
      status: req.query.status,
      role: req.user.role
    });
    
    // Максимально упрощенный запрос без join-ов
    const payments = await Payment.findAll({
      where: whereClause,
      attributes: ['id', 'userId', 'bookingId', 'amount', 'status', 'paymentMethod', 'paymentDate'],
      order: [['paymentDate', 'DESC']]
    });
  
    console.log('Найдено платежей:', payments.length);
  
    res.status(200).json({
      payments: payments
    });
  } catch (error) {
    console.error('Ошибка при получении списка всех платежей:', error);
    res.status(500).json({ message: 'Ошибка при получении списка всех платежей' });
  }
};

// Обновление статуса платежа
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('Обновление статуса платежа:', { id, status, user: req.user.role });
    
    // Проверка валидности статуса
    const validStatuses = ['pending', 'completed', 'failed', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус платежа' });
    }
    
    // Поиск платежа
    const payment = await Payment.findByPk(id, {
      include: [{ model: Booking }]
    });
    
    if (!payment) {
      return res.status(404).json({ message: 'Платеж не найден' });
    }
    
    console.log('Найден платеж:', payment.toJSON());
    
    // Обновление статуса
    const oldStatus = payment.status;
    payment.status = status;
    await payment.save();
    
    console.log(`Статус платежа изменен с ${oldStatus} на ${status}`);
    
    // Если статус платежа изменен на 'завершен', обновляем статус бронирования
    if (status === 'completed' && payment.Booking) {
      const booking = payment.Booking;
      booking.status = 'confirmed';
      await booking.save();
      console.log('Бронирование подтверждено:', booking.id);
    } else if ((status === 'cancelled' || status === 'failed') && payment.Booking) {
      // Если платеж отменен или не удался, отменяем бронирование
      const booking = payment.Booking;
      booking.status = 'cancelled';
      await booking.save();
    }
    
    res.status(200).json({ 
      message: 'Статус платежа успешно обновлен',
      payment: {
        id: payment.id,
        status: payment.status,
        bookingId: payment.bookingId
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса платежа:', error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса платежа' });
  }
};

module.exports = {
  createPayment,
  getUserPayments,
  getPaymentById,
  handlePaymentWebhook,
  updatePaymentStatus,
  refundPayment,
  getAllPayments
};
