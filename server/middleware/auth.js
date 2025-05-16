const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    // Получаем токен из заголовка Authorization
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован. Токен не предоставлен.' });
    }

    // Проверяем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Находим пользователя по ID из токена
    const user = await User.findOne({ where: { id: decoded.id, status: 'active' } });
    
    if (!user) {
      return res.status(401).json({ message: 'Не авторизован. Пользователь не найден.' });
    }

    // Добавляем пользователя в объект запроса
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Ошибка аутентификации:', error.message);
    res.status(401).json({ message: 'Не авторизован. Недействительный токен.' });
  }
};

module.exports = auth;
