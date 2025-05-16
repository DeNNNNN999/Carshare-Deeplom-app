const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const { jwt, email } = require('../utils');

// Временное хранилище токенов верификации (в реальном приложении должно быть в БД)
const verificationTokens = new Map();
const resetTokens = new Map();

// Регистрация пользователя
const register = async (req, res) => {
  try {
    const { email: userEmail, password, firstName, lastName, phone } = req.body;

    // Проверка, существует ли пользователь с таким email
    const existingUser = await User.findOne({ where: { email: userEmail } });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // Создание нового пользователя
    const user = await User.create({
      email: userEmail,
      password, // Хеширование пароля происходит в модели (хук beforeCreate)
      firstName,
      lastName,
      phone
    });

    // Автоматически устанавливаем аккаунт как подтвержденный
    user.isVerified = true;
    await user.save();

    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован. Вы можете войти в систему.'
    });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
  }
};

// Верификация email пользователя
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Получение ID пользователя из токена
    const userId = verificationTokens.get(token);
    
    if (!userId) {
      return res.status(400).json({ message: 'Недействительный или устаревший токен верификации' });
    }

    // Обновление статуса пользователя
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.isVerified = true;
    await user.save();

    // Удаление использованного токена
    verificationTokens.delete(token);

    res.status(200).json({ message: 'Email успешно подтвержден. Теперь вы можете войти в систему.' });
  } catch (error) {
    console.error('Ошибка при верификации email:', error);
    res.status(500).json({ message: 'Ошибка при верификации email' });
  }
};

// Авторизация пользователя
const login = async (req, res) => {
  try {
    const { email: userEmail, password } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ where: { email: userEmail } });
    
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    // Проверка верификации email (оставлено для совместимости, но не должно срабатывать)

    // Проверка статуса пользователя
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Ваш аккаунт заблокирован. Обратитесь в службу поддержки.' });
    }

    // Генерация JWT токена
    const token = jwt.generateToken(user);

    res.status(200).json({
      message: 'Успешная авторизация',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Ошибка при авторизации:', error);
    res.status(500).json({ message: 'Ошибка при авторизации' });
  }
};

// Выход из системы
const logout = (req, res) => {
  // Client-side logout (удаление токена из localStorage)
  res.status(200).json({ message: 'Выход из системы выполнен успешно' });
};

// Запрос на сброс пароля (упрощенная версия без отправки email)
const forgotPassword = async (req, res) => {
  try {
    const { email: userEmail } = req.body;

    // Поиск пользователя по email
    const user = await User.findOne({ where: { email: userEmail } });

    // Для тестовой версии просто создаем токен
    if (user) {
      const token = uuidv4();
      resetTokens.set(token, { userId: user.id, expires: Date.now() + 3600000 }); // Срок действия 1 час
      
      // Возвращаем токен в ответе - только для тестовой среды!
      return res.status(200).json({ 
        message: 'Токен для сброса пароля создан',
        resetToken: token
      });
    }

    res.status(200).json({ 
      message: 'Если указанный email зарегистрирован, вы получите инструкции по сбросу пароля.' 
    });
  } catch (error) {
    console.error('Ошибка при запросе сброса пароля:', error);
    res.status(500).json({ message: 'Ошибка при запросе сброса пароля' });
  }
};

// Сброс пароля
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Получение информации о токене
    const tokenInfo = resetTokens.get(token);
    
    if (!tokenInfo) {
      return res.status(400).json({ message: 'Недействительный или устаревший токен сброса пароля' });
    }

    // Проверка срока действия токена
    if (tokenInfo.expires < Date.now()) {
      resetTokens.delete(token);
      return res.status(400).json({ message: 'Токен сброса пароля устарел. Запросите новый.' });
    }

    // Обновление пароля пользователя
    const user = await User.findByPk(tokenInfo.userId);
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    user.password = password; // Хеширование пароля происходит в модели (хук beforeUpdate)
    await user.save();

    // Удаление использованного токена
    resetTokens.delete(token);

    res.status(200).json({ message: 'Пароль успешно изменен. Теперь вы можете войти в систему.' });
  } catch (error) {
    console.error('Ошибка при сбросе пароля:', error);
    res.status(500).json({ message: 'Ошибка при сбросе пароля' });
  }
};

// Обновление токена
const refreshToken = async (req, res) => {
  try {
    // В реальном приложении здесь должна быть логика с refresh токенами
    // Но для простоты используем текущий токен для проверки
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован. Токен не предоставлен.' });
    }

    // Проверяем токен
    const decoded = jwt.verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Невалидный или устаревший токен' });
    }

    // Находим пользователя по ID из токена
    const user = await User.findOne({ where: { id: decoded.id, status: 'active' } });
    
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден или заблокирован' });
    }

    // Генерация нового JWT токена
    const newToken = jwt.generateToken(user);

    res.status(200).json({
      message: 'Токен успешно обновлен',
      token: newToken
    });
  } catch (error) {
    console.error('Ошибка при обновлении токена:', error);
    res.status(500).json({ message: 'Ошибка при обновлении токена' });
  }
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  refreshToken
};
