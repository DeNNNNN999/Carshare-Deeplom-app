const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Регистрация пользователя
router.post('/register', authController.register);

// Авторизация
router.post('/login', authController.login);

// Выход из системы
router.post('/logout', auth, authController.logout);

// Верификация email
router.get('/verify-email/:token', authController.verifyEmail);

// Обновление токена
router.post('/refresh-token', authController.refreshToken);

// Запрос на сброс пароля
router.post('/forgot-password', authController.forgotPassword);

// Сброс пароля
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
