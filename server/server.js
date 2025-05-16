const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sequelize = require('./config/database');
const routes = require('./routes');
const { errorHandler } = require('./middleware');

// Загрузка переменных окружения
dotenv.config();

// Инициализация приложения
const app = express();

// Настройка middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Маршруты API
app.use('/api', routes);

// Обработка ошибок
app.use(errorHandler);

// Определение порта
const PORT = process.env.PORT || 5000;

// Запуск сервера
const startServer = async () => {
  try {
    // Проверка соединения с базой данных
    await sequelize.authenticate();
    console.log('Соединение с базой данных установлено успешно');

    // Синхронизация моделей с базой данных
    // В production использовать { force: false }
    await sequelize.sync({ force: false });
    console.log('Модели синхронизированы с базой данных');
    
    // Запуск инициализации базы данных, если режим разработки
    if (process.env.NODE_ENV === 'development') {
      const {
        createAdmin,
        createManager,
        createCars,
        createRentalPlans
      } = require('./init-db');
      
      const { createTestPayments } = require('./create-test-payments');
      
      try {
        await createAdmin();
        await createManager();
        await createCars();
        await createRentalPlans();
        await createTestPayments();
        console.log('База данных инициализирована');
      } catch (initError) {
        console.error('Ошибка при инициализации тестовых данных:', initError);
      }
    }

    // Запуск сервера
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
      console.log(`Режим: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('Ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

// Запуск приложения
startServer();

// Обработка необработанных исключений
process.on('uncaughtException', (error) => {
  console.error('Необработанное исключение:', error);
  process.exit(1);
});

// Обработка необработанных промисов
process.on('unhandledRejection', (error) => {
  console.error('Необработанный промис:', error);
  process.exit(1);
});
