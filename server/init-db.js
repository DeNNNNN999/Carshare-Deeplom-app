const bcrypt = require('bcryptjs');
const { User, Car, RentalPlan } = require('./models');
const sequelize = require('./config/database');

// Функция для создания администратора
const createAdmin = async () => {
  try {
    const admin = await User.findOne({ where: { email: 'admin@carshare.com' } });
    if (!admin) {
      await User.create({
        email: 'admin@carshare.com',
        password: 'admin123', // будет захэшировано через хук в модели
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
        status: 'active'
      });
      console.log('Администратор успешно создан');
    } else {
      console.log('Администратор уже существует');
    }
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  }
};

// Функция для создания менеджера
const createManager = async () => {
  try {
    const manager = await User.findOne({ where: { email: 'manager@carshare.com' } });
    if (!manager) {
      await User.create({
        email: 'manager@carshare.com',
        password: 'password', // будет захэшировано через хук в модели
        firstName: 'Мария',
        lastName: 'Сидорова',
        phone: '+7 (999) 555-55-55',
        birthDate: '1992-07-20',
        licenseNumber: 'EF456789',
        licenseIssueDate: '2016-08-15',
        licenseExpiryDate: '2026-08-15',
        role: 'manager',
        isVerified: true,
        status: 'active'
      });
      console.log('Менеджер успешно создан');
    } else {
      console.log('Менеджер уже существует');
    }
  } catch (error) {
    console.error('Ошибка при создании менеджера:', error);
  }
};

// Функция для создания тестовых автомобилей
const createCars = async () => {
  try {
    const carsCount = await Car.count();
    if (carsCount === 0) {
      const cars = [
        {
          model: 'X5',
          brand: 'BMW',
          year: 2022,
          registrationNumber: 'A123BC',
          color: 'Черный',
          fuelType: 'Бензин',
          transmission: 'Автомат',
          category: 'SUV',
          seats: 5,
          dailyRate: 6000,
          hourlyRate: 500,
          minuteRate: 10,
          status: 'available',
          mileage: 5000,
          imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format',
          latitude: 55.7558,
          longitude: 37.6176
        },
        {
          model: 'Model 3',
          brand: 'Tesla',
          year: 2023,
          registrationNumber: 'B456DE',
          color: 'Белый',
          fuelType: 'Электро',
          transmission: 'Автомат',
          category: 'Седан',
          seats: 5,
          dailyRate: 5500,
          hourlyRate: 450,
          minuteRate: 9,
          status: 'available',
          mileage: 2000,
          imageUrl: 'https://images.unsplash.com/photo-1619317602316-bdf458a1ca8d?w=800&auto=format',
          latitude: 55.7525,
          longitude: 37.6231
        },
        {
          model: 'Octavia',
          brand: 'Skoda',
          year: 2022,
          registrationNumber: 'C789FG',
          color: 'Серый',
          fuelType: 'Дизель',
          transmission: 'Механика',
          category: 'Универсал',
          seats: 5,
          dailyRate: 3500,
          hourlyRate: 300,
          minuteRate: 6,
          status: 'available',
          mileage: 8000,
          imageUrl: 'https://images.unsplash.com/photo-1631723047329-44353d5e748f?w=800&auto=format',
          latitude: 55.7822,
          longitude: 37.6511
        },
        {
          model: 'Solaris',
          brand: 'Hyundai',
          year: 2021,
          registrationNumber: 'D012HI',
          color: 'Красный',
          fuelType: 'Бензин',
          transmission: 'Механика',
          category: 'Седан',
          seats: 5,
          dailyRate: 2500,
          hourlyRate: 200,
          minuteRate: 4,
          status: 'available',
          mileage: 12000,
          imageUrl: 'https://images.unsplash.com/photo-1567602147270-4c5783517949?w=800&auto=format',
          latitude: 55.7636,
          longitude: 37.6087
        },
        {
          model: 'RAV4',
          brand: 'Toyota',
          year: 2022,
          registrationNumber: 'E345JK',
          color: 'Синий',
          fuelType: 'Гибрид',
          transmission: 'Автомат',
          category: 'SUV',
          seats: 5,
          dailyRate: 4500,
          hourlyRate: 400,
          minuteRate: 8,
          status: 'available',
          mileage: 6000,
          imageUrl: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&auto=format',
          latitude: 55.7483,
          longitude: 37.6377
        }
      ];

      await Car.bulkCreate(cars);
      console.log('Тестовые автомобили успешно созданы');
    } else {
      console.log('Автомобили уже существуют');
    }
  } catch (error) {
    console.error('Ошибка при создании тестовых автомобилей:', error);
  }
};

// Функция для создания тарифных планов
const createRentalPlans = async () => {
  try {
    const plansCount = await RentalPlan.count();
    if (plansCount === 0) {
      const plans = [
        {
          name: 'Поминутная аренда',
          description: 'Идеально для коротких поездок по городу',
          durationType: 'minute',
          basePrice: 100,
          pricePerUnit: 5,
          minDuration: 15,
          maxDuration: 180,
          isActive: true
        },
        {
          name: 'Почасовая аренда',
          description: 'Оптимально для длительных поездок в течение дня',
          durationType: 'hour',
          basePrice: 300,
          pricePerUnit: 250,
          minDuration: 1,
          maxDuration: 12,
          isActive: true
        },
        {
          name: 'Дневная аренда',
          description: 'Для поездок на целый день',
          durationType: 'day',
          basePrice: 1000,
          pricePerUnit: 2500,
          minDuration: 1,
          maxDuration: 7,
          isActive: true
        },
        {
          name: 'Недельная аренда',
          description: 'Выгодно для длительных поездок на несколько дней',
          durationType: 'week',
          basePrice: 5000,
          pricePerUnit: 12000,
          minDuration: 1,
          maxDuration: 4,
          discountPercent: 10,
          isActive: true
        },
        {
          name: 'Месячная аренда',
          description: 'Самый выгодный вариант для долгосрочной аренды',
          durationType: 'month',
          basePrice: 10000,
          pricePerUnit: 40000,
          minDuration: 1,
          maxDuration: 3,
          discountPercent: 15,
          isActive: true
        }
      ];

      await RentalPlan.bulkCreate(plans);
      console.log('Тарифные планы успешно созданы');
    } else {
      console.log('Тарифные планы уже существуют');
    }
  } catch (error) {
    console.error('Ошибка при создании тарифных планов:', error);
  }
};

// Функция для инициализации базы данных
const initializeDatabase = async () => {
  try {
    console.log('Инициализация базы данных...');
    
    // Синхронизация моделей с базой данных
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('Модели синхронизированы с базой данных');
    
    // Создание начальных данных
    await createAdmin();
    await createManager();
    await createCars();
    await createRentalPlans();
    
    console.log('Инициализация базы данных завершена');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при инициализации базы данных:', error);
    process.exit(1);
  }
};

// Экспорт функций для использования в других модулях
module.exports = {
  createAdmin,
  createManager,
  createCars,
  createRentalPlans,
  initializeDatabase
};
