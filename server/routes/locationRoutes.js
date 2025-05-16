const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { auth } = require('../middleware');

// Middleware для проверки специального ключа API для IoT-устройств
const checkApiKey = (req, res, next) => {
  const apiKey = req.header('X-API-Key');
  
  if (!apiKey || apiKey !== process.env.IOT_API_KEY) {
    return res.status(401).json({ message: 'Неавторизованный доступ' });
  }
  
  next();
};

// Получение местоположения автомобилей в заданном радиусе
router.get('/', locationController.getCarsInRadius);

// Обновление местоположения автомобиля (для IoT-устройств в автомобилях)
router.put('/:carId', checkApiKey, locationController.updateCarLocation);

module.exports = router;
