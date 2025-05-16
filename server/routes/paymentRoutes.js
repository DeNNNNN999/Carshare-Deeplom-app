const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth, admin, manager } = require('../middleware');

// Создание платежа
router.post('/', auth, paymentController.createPayment);

// Получение списка платежей пользователя
router.get('/', auth, paymentController.getUserPayments);

// [ADMIN/MANAGER] Получение всех платежей
router.get('/all', [auth, manager], paymentController.getAllPayments);

// Обработка webhook от платежной системы
router.post('/webhook', paymentController.handlePaymentWebhook);

// Получение информации о конкретном платеже
router.get('/:id', auth, paymentController.getPaymentById);

// Обновление статуса платежа
router.put('/:id/status', [auth, manager], paymentController.updatePaymentStatus);

// [ADMIN] Возврат средств
router.post('/:id/refund', [auth, admin], paymentController.refundPayment);

module.exports = router;
