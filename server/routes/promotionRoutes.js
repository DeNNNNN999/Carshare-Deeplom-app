const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const { auth, admin } = require('../middleware');

// Получение активных акций
router.get('/', promotionController.getActivePromotions);

// Применение промокода
router.post('/apply-promo', auth, promotionController.applyPromoCode);

// [ADMIN] Создание акции
router.post('/', [auth, admin], promotionController.createPromotion);

// [ADMIN] Обновление акции
router.put('/:id', [auth, admin], promotionController.updatePromotion);

// [ADMIN] Активация/деактивация акции
router.put('/:id/status', [auth, admin], promotionController.updatePromotionStatus);

module.exports = router;
