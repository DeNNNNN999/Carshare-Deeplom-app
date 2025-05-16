const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { auth, admin } = require('../middleware');

// Получение списка доступных автомобилей с фильтрацией
router.get('/', carController.getAvailableCars);

// Получение информации о конкретном автомобиле
router.get('/:id', carController.getCarById);

// [ADMIN] Добавление нового автомобиля
router.post('/', [auth, admin], carController.createCar);

// [ADMIN] Обновление информации об автомобиле
router.put('/:id', [auth, admin], carController.updateCar);

// [ADMIN] Изменение статуса автомобиля
router.put('/:id/status', [auth, admin], carController.updateCarStatus);

// [ADMIN] Получение истории аренды автомобиля
router.get('/:id/history', [auth, admin], carController.getCarRentalHistory);

module.exports = router;
