const { Car, CarLocation } = require('../models');
const { geo } = require('../utils');

// Получение местоположения автомобилей в заданном радиусе
const getCarsInRadius = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Необходимо указать координаты (latitude, longitude)' });
    }
    
    // Получение всех доступных автомобилей
    const cars = await Car.findAll({
      where: { status: 'available' },
      attributes: ['id', 'brand', 'model', 'registrationNumber', 'category', 'color', 'imageUrl', 'latitude', 'longitude']
    });
    
    // Фильтрация автомобилей по радиусу
    const carsInRadius = geo.findCarsInRadius(latitude, longitude, cars, parseFloat(radius));
    
    // Добавление расстояния до каждого автомобиля
    const carsWithDistance = carsInRadius.map(car => {
      const distance = geo.calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(car.latitude),
        parseFloat(car.longitude)
      );
      
      return {
        ...car.toJSON(),
        distance: parseFloat(distance.toFixed(2))  // Расстояние в км, округленное до 2 знаков
      };
    });
    
    // Сортировка по расстоянию (ближайшие сначала)
    carsWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ 
      count: carsWithDistance.length,
      cars: carsWithDistance
    });
  } catch (error) {
    console.error('Ошибка при получении местоположения автомобилей:', error);
    res.status(500).json({ message: 'Ошибка при получении местоположения автомобилей' });
  }
};

// Обновление местоположения автомобиля (для IoT-устройств в автомобилях)
const updateCarLocation = async (req, res) => {
  try {
    const { carId } = req.params;
    const { latitude, longitude } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Необходимо указать координаты (latitude, longitude)' });
    }
    
    // Проверка существования автомобиля
    const car = await Car.findByPk(carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Обновление координат автомобиля в таблице Car
    car.latitude = latitude;
    car.longitude = longitude;
    await car.save();

    // Добавление записи в историю местоположений
    await CarLocation.create({
      carId,
      latitude,
      longitude
    });

    res.status(200).json({ 
      message: 'Местоположение автомобиля успешно обновлено',
      location: {
        carId,
        latitude,
        longitude,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении местоположения автомобиля:', error);
    res.status(500).json({ message: 'Ошибка при обновлении местоположения автомобиля' });
  }
};

module.exports = {
  getCarsInRadius,
  updateCarLocation
};
