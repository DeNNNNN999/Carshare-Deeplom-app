const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { auth, admin } = require('../middleware');

// [ADMIN] Получение общей статистики
router.get('/overview', [auth, admin], statisticsController.getOverviewStats);

// [ADMIN] Статистика по автомобилям
router.get('/cars', [auth, admin], statisticsController.getCarStats);

// [ADMIN] Статистика по пользователям
router.get('/users', [auth, admin], statisticsController.getUserStats);

// [ADMIN] Статистика по доходам
router.get('/revenue', [auth, admin], statisticsController.getRevenueStats);

// [ADMIN] Статистика по долгосрочной аренде
router.get('/long-term', [auth, admin], statisticsController.getLongTermStats);

module.exports = router;
