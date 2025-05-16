const errorHandler = (err, req, res, next) => {
  console.error('Ошибка:', err.message);
  console.error('Стек:', err.stack);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Что-то пошло не так';

  // Обработка ошибок Sequelize
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map(e => e.message).join(', ');
  }

  // Обработка ошибок JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Недействительный токен авторизации';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
