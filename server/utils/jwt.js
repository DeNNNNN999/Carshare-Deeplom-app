const jwt = require('jsonwebtoken');

// Генерация JWT токена
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id,
      email: user.email,
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Верификация JWT токена
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Ошибка верификации токена:', error.message);
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
