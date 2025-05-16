const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, admin } = require('../middleware');

// Создание отзыва
router.post('/', auth, reviewController.createReview);

// Получение отзывов о конкретном автомобиле
router.get('/car/:carId', reviewController.getCarReviews);

// Получение отзывов пользователя
router.get('/user', auth, reviewController.getUserReviews);

// [ADMIN] Модерация отзывов
router.put('/:id/moderate', [auth, admin], reviewController.moderateReview);

module.exports = router;
