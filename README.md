# CarShare - Каршеринговое приложение с функцией долгой аренды

## Описание проекта

CarShare - это современное веб-приложение для каршеринговой компании, позволяющее пользователям находить, бронировать и оплачивать аренду автомобилей. Особенностью системы является наличие функции "долгой аренды" - возможность арендовать автомобиль на длительный срок (неделя, месяц) с выгодными тарифами.

## Технологии

### Бэкенд
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT для аутентификации
- Nodemailer для отправки email

### Фронтенд (в разработке)
- React
- Tailwind CSS
- Anime.js
- Redux для управления состоянием

## Функциональность

- Регистрация и авторизация пользователей
- Управление профилем и документами
- Поиск доступных автомобилей с фильтрацией
- Бронирование автомобилей на различные периоды времени
- Гибкая система тарифных планов
- Оплата и управление платежами
- Система отзывов
- Акции и промокоды
- Административная панель с полным управлением системой
- Статистика и аналитика

## Структура проекта

```
CarShare/
├── server/             # Бэкенд приложения
│   ├── config/         # Конфигурационные файлы
│   ├── controllers/    # Контроллеры API
│   ├── middleware/     # Middleware функции
│   ├── models/         # Модели данных (Sequelize)
│   ├── routes/         # API маршруты
│   ├── utils/          # Утилиты и вспомогательные функции
│   ├── uploads/        # Директория для загрузки файлов
│   ├── .env            # Переменные окружения
│   ├── server.js       # Входная точка приложения
│   └── init-db.js      # Скрипт для инициализации БД
└── client/             # Фронтенд приложения (React)
```

## Установка и запуск

### Предварительные требования
- Node.js (v14 или выше)
- PostgreSQL (v12 или выше)

### Установка и запуск сервера

1. Клонировать репозиторий
```
git clone https://github.com/yourusername/carshare.git
cd carshare
```

2. Установить зависимости сервера
```
cd server
npm install
```

3. Создать базу данных PostgreSQL
```
createdb carshare
```

4. Настроить переменные окружения
```
cp .env.example .env
```
Отредактировать файл .env, указав настройки подключения к базе данных и другие параметры.

5. Инициализировать базу данных
```
npm run init-db
```

6. Запустить сервер
```
npm run dev
```

Сервер будет запущен на порту 5000 (или на порту, указанном в переменной окружения PORT).

## API Документация

### Аутентификация
- `POST /api/auth/register` - Регистрация пользователя
- `POST /api/auth/login` - Авторизация
- `POST /api/auth/logout` - Выход из системы
- `GET /api/auth/verify-email/:token` - Верификация email
- `POST /api/auth/refresh-token` - Обновление токена
- `POST /api/auth/forgot-password` - Запрос на сброс пароля
- `POST /api/auth/reset-password/:token` - Сброс пароля

### Пользователи
- `GET /api/users/profile` - Получение профиля текущего пользователя
- `PUT /api/users/profile` - Редактирование профиля
- `POST /api/users/documents` - Загрузка документов
- `GET /api/users/documents` - Получение документов пользователя
- `GET /api/users` - [ADMIN] Получение списка всех пользователей
- `GET /api/users/:id` - [ADMIN] Получение информации о пользователе
- `PUT /api/users/:id` - [ADMIN] Обновление информации о пользователе
- `PUT /api/users/:id/status` - [ADMIN] Блокировка/разблокировка пользователя

### Автомобили
- `GET /api/cars` - Получение списка доступных автомобилей
- `GET /api/cars/:id` - Получение информации об автомобиле
- `POST /api/cars` - [ADMIN] Добавление нового автомобиля
- `PUT /api/cars/:id` - [ADMIN] Обновление информации об автомобиле
- `PUT /api/cars/:id/status` - [ADMIN] Изменение статуса автомобиля
- `GET /api/cars/:id/history` - [ADMIN] Получение истории аренды автомобиля

### Бронирования
- `POST /api/bookings` - Создание бронирования
- `GET /api/bookings` - Получение списка бронирований пользователя
- `GET /api/bookings/:id` - Получение информации о бронировании
- `PUT /api/bookings/:id/cancel` - Отмена бронирования
- `PUT /api/bookings/:id/extend` - Продление аренды
- `PUT /api/bookings/:id/complete-early` - Досрочное завершение аренды
- `PUT /api/bookings/:id/confirm` - [ADMIN/MANAGER] Подтверждение бронирования
- `GET /api/bookings/all` - [ADMIN/MANAGER] Получение всех бронирований

### Тарифные планы
- `GET /api/rental-plans` - Получение списка тарифных планов
- `GET /api/rental-plans/:id` - Получение информации о тарифном плане
- `POST /api/rental-plans` - [ADMIN] Создание тарифного плана
- `PUT /api/rental-plans/:id` - [ADMIN] Обновление тарифного плана
- `PUT /api/rental-plans/:id/status` - [ADMIN] Активация/деактивация тарифного плана

### Платежи
- `POST /api/payments` - Создание платежа
- `GET /api/payments` - Получение списка платежей пользователя
- `GET /api/payments/:id` - Получение информации о платеже
- `POST /api/payments/webhook` - Обработка webhook от платежной системы
- `POST /api/payments/:id/refund` - [ADMIN] Возврат средств
- `GET /api/payments/all` - [ADMIN] Получение всех платежей

### Местоположение
- `GET /api/locations` - Получение местоположения автомобилей в радиусе
- `PUT /api/locations/:carId` - Обновление местоположения автомобиля

### Отзывы
- `POST /api/reviews` - Создание отзыва
- `GET /api/reviews/car/:carId` - Получение отзывов об автомобиле
- `GET /api/reviews/user` - Получение отзывов пользователя
- `PUT /api/reviews/:id/moderate` - [ADMIN] Модерация отзывов

### Акции и промокоды
- `GET /api/promotions` - Получение активных акций
- `POST /api/promotions/apply-promo` - Применение промокода
- `POST /api/promotions` - [ADMIN] Создание акции
- `PUT /api/promotions/:id` - [ADMIN] Обновление акции
- `PUT /api/promotions/:id/status` - [ADMIN] Активация/деактивация акции

### Статистика
- `GET /api/statistics/overview` - [ADMIN] Получение общей статистики
- `GET /api/statistics/cars` - [ADMIN] Статистика по автомобилям
- `GET /api/statistics/users` - [ADMIN] Статистика по пользователям
- `GET /api/statistics/revenue` - [ADMIN] Статистика по доходам
- `GET /api/statistics/long-term` - [ADMIN] Статистика по долгосрочной аренде

## Авторы
- Ваше имя - Разработчик

## Лицензия
MIT
