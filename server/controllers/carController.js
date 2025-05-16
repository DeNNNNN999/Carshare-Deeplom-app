const { Car, Booking, Review, User } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');
const { geo } = require('../utils');

// Получение списка доступных автомобилей с фильтрацией
const getAvailableCars = async (req, res) => {
  try {
    // Параметры фильтрации
    const { 
      startDate, endDate, brand, model, category, 
      fuelType, transmission, minSeats, maxPrice,
      latitude, longitude, radius
    } = req.query;
    
    const whereClause = {
      status: 'available'
    };
    
    // Фильтрация по бренду
    if (brand) {
      whereClause.brand = brand;
    }
    
    // Фильтрация по модели
    if (model) {
      whereClause.model = { [Op.iLike]: `%${model}%` };
    }
    
    // Фильтрация по категории
    if (category) {
      whereClause.category = category;
    }
    
    // Фильтрация по типу топлива
    if (fuelType) {
      whereClause.fuelType = fuelType;
    }
    
    // Фильтрация по типу трансмиссии
    if (transmission) {
      whereClause.transmission = transmission;
    }
    
    // Фильтрация по количеству мест
    if (minSeats) {
      whereClause.seats = { [Op.gte]: parseInt(minSeats) };
    }
    
    // Фильтрация по цене (дневной тариф)
    if (maxPrice) {
      whereClause.dailyRate = { [Op.lte]: parseFloat(maxPrice) };
    }
    
    // Фильтрация по доступности в указанный период
    let excludedCarIds = [];
    if (startDate && endDate) {
      const overlappingBookings = await Booking.findAll({
        where: {
          status: {
            [Op.notIn]: ['cancelled', 'completed']
          },
          [Op.or]: [
            {
              startDate: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
              }
            },
            {
              endDate: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
              }
            },
            {
              [Op.and]: [
                { startDate: { [Op.lte]: new Date(startDate) } },
                { endDate: { [Op.gte]: new Date(endDate) } }
              ]
            }
          ]
        },
        attributes: ['carId']
      });
      
      excludedCarIds = overlappingBookings.map(booking => booking.carId);
      
      if (excludedCarIds.length > 0) {
        whereClause.id = { [Op.notIn]: excludedCarIds };
      }
    }
    
    // Получение автомобилей
    let cars = await Car.findAll({
      where: whereClause,
      include: [{
        model: Review,
        attributes: [],
        required: false
      }],
      attributes: {
        include: [
          [sequelize.fn('AVG', sequelize.col('Reviews.rating')), 'averageRating']
        ]
      },
      group: ['Car.id', 'Car.model', 'Car.brand', 'Car.year', 'Car.registrationNumber', 'Car.color',
             'Car.fuelType', 'Car.transmission', 'Car.category', 'Car.seats', 'Car.dailyRate',
             'Car.hourlyRate', 'Car.minuteRate', 'Car.status', 'Car.mileage', 'Car.imageUrl',
             'Car.latitude', 'Car.longitude', 'Car.createdAt', 'Car.updatedAt']
    });
    
    // Фильтрация по местоположению (если указаны координаты и радиус)
    if (latitude && longitude && radius) {
      cars = geo.findCarsInRadius(latitude, longitude, cars, parseFloat(radius));
    }
    
    res.status(200).json({ 
      count: cars.length, 
      cars 
    });
  } catch (error) {
    console.error('Ошибка при получении списка автомобилей:', error);
    res.status(500).json({ message: 'Ошибка при получении списка автомобилей' });
  }
};

// Получение информации о конкретном автомобиле
const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const car = await Car.findByPk(id, {
      include: [{
        model: Review,
        attributes: ['id', 'rating', 'comment', 'createdAt'],
        include: [{
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }],
        where: {
          isApproved: true
        },
        required: false
      }]
    });
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Расчет средней оценки
    let averageRating = 0;
    if (car.Reviews && car.Reviews.length > 0) {
      const sum = car.Reviews.reduce((total, review) => total + review.rating, 0);
      averageRating = sum / car.Reviews.length;
    }

    const carWithRating = {
      ...car.toJSON(),
      averageRating
    };

    res.status(200).json({ car: carWithRating });
  } catch (error) {
    console.error('Ошибка при получении информации об автомобиле:', error);
    res.status(500).json({ message: 'Ошибка при получении информации об автомобиле' });
  }
};

// [ADMIN] Добавление нового автомобиля
const createCar = async (req, res) => {
  try {
    const { 
      model, brand, year, registrationNumber, color,
      fuelType, transmission, category, seats,
      dailyRate, hourlyRate, minuteRate, mileage,
      latitude, longitude, imageUrl
    } = req.body;

    // Проверка уникальности регистрационного номера
    const existingCar = await Car.findOne({
      where: { registrationNumber }
    });

    if (existingCar) {
      return res.status(400).json({ message: 'Автомобиль с таким регистрационным номером уже существует' });
    }

    // Создание нового автомобиля
    const car = await Car.create({
      model,
      brand,
      year,
      registrationNumber,
      color,
      fuelType,
      transmission,
      category,
      seats,
      dailyRate,
      hourlyRate,
      minuteRate,
      mileage,
      latitude,
      longitude,
      imageUrl,
      status: 'available'
    });

    res.status(201).json({ 
      message: 'Автомобиль успешно добавлен',
      car
    });
  } catch (error) {
    console.error('Ошибка при создании автомобиля:', error);
    res.status(500).json({ message: 'Ошибка при создании автомобиля' });
  }
};

// [ADMIN] Обновление информации об автомобиле
const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      model, brand, year, registrationNumber, color,
      fuelType, transmission, category, seats,
      dailyRate, hourlyRate, minuteRate, mileage,
      latitude, longitude, imageUrl
    } = req.body;

    // Поиск автомобиля
    const car = await Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Проверка уникальности регистрационного номера (если он изменился)
    if (registrationNumber && registrationNumber !== car.registrationNumber) {
      const existingCar = await Car.findOne({
        where: { registrationNumber }
      });

      if (existingCar && existingCar.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Автомобиль с таким регистрационным номером уже существует' });
      }
    }

    // Обновление данных автомобиля
    if (model) car.model = model;
    if (brand) car.brand = brand;
    if (year) car.year = year;
    if (registrationNumber) car.registrationNumber = registrationNumber;
    if (color) car.color = color;
    if (fuelType) car.fuelType = fuelType;
    if (transmission) car.transmission = transmission;
    if (category) car.category = category;
    if (seats) car.seats = seats;
    if (dailyRate) car.dailyRate = dailyRate;
    if (hourlyRate) car.hourlyRate = hourlyRate;
    if (minuteRate) car.minuteRate = minuteRate;
    if (mileage) car.mileage = mileage;
    if (latitude) car.latitude = latitude;
    if (longitude) car.longitude = longitude;
    if (imageUrl) car.imageUrl = imageUrl;

    await car.save();

    res.status(200).json({ 
      message: 'Информация об автомобиле успешно обновлена',
      car
    });
  } catch (error) {
    console.error('Ошибка при обновлении информации об автомобиле:', error);
    res.status(500).json({ message: 'Ошибка при обновлении информации об автомобиле' });
  }
};

// [ADMIN] Изменение статуса автомобиля
const updateCarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['available', 'rented', 'maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Неверный статус автомобиля' });
    }
    
    const car = await Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    car.status = status;
    await car.save();

    res.status(200).json({ 
      message: `Статус автомобиля изменен на "${status}"`,
      car: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        status: car.status
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса автомобиля:', error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса автомобиля' });
  }
};

// [ADMIN] Получение истории аренды автомобиля
const getCarRentalHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Проверка существования автомобиля
    const car = await Car.findByPk(id);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Получение истории аренды
    const bookings = await Booking.findAll({
      where: { carId: id },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'email']
      }],
      order: [['startDate', 'DESC']]
    });

    res.status(200).json({ 
      car: {
        id: car.id,
        brand: car.brand,
        model: car.model,
        registrationNumber: car.registrationNumber
      },
      bookings
    });
  } catch (error) {
    console.error('Ошибка при получении истории аренды автомобиля:', error);
    res.status(500).json({ message: 'Ошибка при получении истории аренды автомобиля' });
  }
};

module.exports = {
  getAvailableCars,
  getCarById,
  createCar,
  updateCar,
  updateCarStatus,
  getCarRentalHistory
};
