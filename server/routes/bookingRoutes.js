const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, manager } = require('../middleware');

// Создание бронирования
router.post('/', auth, bookingController.createBooking);

// Получение списка бронирований пользователя
router.get('/', auth, bookingController.getUserBookings);

// [ADMIN/MANAGER] Получение всех бронирований
router.get('/all', [auth, manager], bookingController.getAllBookings);

// Получение информации о конкретном бронировании
router.get('/:id', auth, bookingController.getBookingById);

// Отмена бронирования
router.put('/:id/cancel', auth, bookingController.cancelBooking);

// Продление аренды
router.put('/:id/extend', auth, bookingController.extendBooking);

// Досрочное завершение аренды
router.put('/:id/complete-early', auth, bookingController.completeBookingEarly);

// [ADMIN/MANAGER] Подтверждение бронирования
router.put('/:id/confirm', [auth, manager], bookingController.confirmBooking);

module.exports = router;
