const { Review, Booking, Car, User } = require('../models');

// Создание отзыва
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({ message: 'Необходимо указать ID бронирования и оценку' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Оценка должна быть от 1 до 5' });
    }

    // Проверка существования бронирования
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId,
        status: 'completed'
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Бронирование не найдено или не завершено' });
    }

    // Проверка наличия существующего отзыва для этого бронирования
    const existingReview = await Review.findOne({
      where: {
        bookingId,
        userId
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Вы уже оставили отзыв для этого бронирования' });
    }

    // Создание нового отзыва
    const review = await Review.create({
      userId,
      carId: booking.carId,
      bookingId,
      rating,
      comment,
      isApproved: true  // По умолчанию отзыв сразу одобрен, но может быть настроено иначе
    });

    res.status(201).json({ 
      message: 'Отзыв успешно создан',
      review
    });
  } catch (error) {
    console.error('Ошибка при создании отзыва:', error);
    res.status(500).json({ message: 'Ошибка при создании отзыва' });
  }
};

// Получение отзывов о конкретном автомобиле
const getCarReviews = async (req, res) => {
  try {
    const { carId } = req.params;
    
    // Проверка существования автомобиля
    const car = await Car.findByPk(carId);
    
    if (!car) {
      return res.status(404).json({ message: 'Автомобиль не найден' });
    }

    // Получение отзывов для автомобиля
    const reviews = await Review.findAll({
      where: {
        carId,
        isApproved: true
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Расчет средней оценки
    let averageRating = 0;
    if (reviews.length > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      averageRating = parseFloat((sum / reviews.length).toFixed(1));
    }

    res.status(200).json({ 
      car: {
        id: car.id,
        brand: car.brand,
        model: car.model
      },
      reviewsCount: reviews.length,
      averageRating,
      reviews
    });
  } catch (error) {
    console.error('Ошибка при получении отзывов об автомобиле:', error);
    res.status(500).json({ message: 'Ошибка при получении отзывов об автомобиле' });
  }
};

// Получение отзывов пользователя
const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const reviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: Car,
          attributes: ['id', 'brand', 'model', 'imageUrl']
        },
        {
          model: Booking,
          attributes: ['id', 'startDate', 'endDate']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Ошибка при получении отзывов пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении отзывов пользователя' });
  }
};

// [ADMIN] Модерация отзывов
const moderateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, moderationComment } = req.body;
    
    if (isApproved === undefined) {
      return res.status(400).json({ message: 'Необходимо указать статус одобрения отзыва' });
    }
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({ message: 'Отзыв не найден' });
    }

    review.isApproved = isApproved;
    
    if (moderationComment) {
      review.moderationComment = moderationComment;
    }
    
    await review.save();

    res.status(200).json({ 
      message: isApproved 
        ? 'Отзыв успешно одобрен' 
        : 'Отзыв отклонен',
      review: {
        id: review.id,
        isApproved: review.isApproved,
        moderationComment: review.moderationComment
      }
    });
  } catch (error) {
    console.error('Ошибка при модерации отзыва:', error);
    res.status(500).json({ message: 'Ошибка при модерации отзыва' });
  }
};

module.exports = {
  createReview,
  getCarReviews,
  getUserReviews,
  moderateReview
};
