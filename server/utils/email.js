const nodemailer = require('nodemailer');

// Создаем транспорт для отправки email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Отправка email верификации
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Подтверждение регистрации в CarShare',
    html: `
      <h1>Подтверждение регистрации</h1>
      <p>Спасибо за регистрацию в сервисе CarShare.</p>
      <p>Для подтверждения вашего email, пожалуйста, перейдите по ссылке:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Отправка email восстановления пароля
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Восстановление пароля в CarShare',
    html: `
      <h1>Восстановление пароля</h1>
      <p>Вы запросили восстановление пароля в сервисе CarShare.</p>
      <p>Для создания нового пароля, пожалуйста, перейдите по ссылке:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Если вы не запрашивали восстановление пароля, просто проигнорируйте это письмо.</p>
      <p>Ссылка действительна в течение 1 часа.</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Отправка подтверждения бронирования
const sendBookingConfirmationEmail = async (email, booking, car) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Подтверждение бронирования CarShare',
    html: `
      <h1>Ваше бронирование подтверждено</h1>
      <p>Спасибо за использование сервиса CarShare.</p>
      <h2>Детали бронирования:</h2>
      <p><strong>Номер бронирования:</strong> ${booking.id}</p>
      <p><strong>Автомобиль:</strong> ${car.brand} ${car.model} (${car.registrationNumber})</p>
      <p><strong>Дата начала:</strong> ${new Date(booking.startDate).toLocaleString()}</p>
      <p><strong>Дата окончания:</strong> ${new Date(booking.endDate).toLocaleString()}</p>
      <p><strong>Общая стоимость:</strong> ${booking.totalCost}</p>
      <p>Приятных поездок с CarShare!</p>
    `
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendBookingConfirmationEmail
};
