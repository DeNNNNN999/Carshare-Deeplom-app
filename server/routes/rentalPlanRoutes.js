const express = require('express');
const router = express.Router();
const rentalPlanController = require('../controllers/rentalPlanController');
const { auth, admin } = require('../middleware');

// Получение списка доступных тарифных планов
router.get('/', rentalPlanController.getAllRentalPlans);

// Получение информации о конкретном тарифном плане
router.get('/:id', rentalPlanController.getRentalPlanById);

// [ADMIN] Создание нового тарифного плана
router.post('/', [auth, admin], rentalPlanController.createRentalPlan);

// [ADMIN] Обновление тарифного плана
router.put('/:id', [auth, admin], rentalPlanController.updateRentalPlan);

// [ADMIN] Активация/деактивация тарифного плана
router.put('/:id/status', [auth, admin], rentalPlanController.updateRentalPlanStatus);

module.exports = router;
