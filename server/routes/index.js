const express = require('express');
const router = express.Router();

// Импорт маршрутов
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const carRoutes = require('./carRoutes');
const bookingRoutes = require('./bookingRoutes');
const rentalPlanRoutes = require('./rentalPlanRoutes');
const paymentRoutes = require('./paymentRoutes');
const locationRoutes = require('./locationRoutes');
const reviewRoutes = require('./reviewRoutes');
const promotionRoutes = require('./promotionRoutes');
const statisticsRoutes = require('./statisticsRoutes');

// Регистрация маршрутов
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/cars', carRoutes);
router.use('/bookings', bookingRoutes);
router.use('/rental-plans', rentalPlanRoutes);
router.use('/payments', paymentRoutes);
router.use('/locations', locationRoutes);
router.use('/reviews', reviewRoutes);
router.use('/promotions', promotionRoutes);
router.use('/statistics', statisticsRoutes);

module.exports = router;
