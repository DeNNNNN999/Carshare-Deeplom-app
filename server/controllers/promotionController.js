const { Promotion } = require('../models');
const { Op } = require('sequelize');

// Получение активных акций
const getActivePromotions = async (req, res) => {
  try {
    const currentDate = new Date();
    
    const promotions = await Promotion.findAll({
      where: {
        isActive: true,
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate },
        [Op.or]: [
          { maxUses: null },
          { usesCount: { [Op.lt]: sequelize.col('maxUses') } }
        ]
      },
      attributes: ['id', 'name', 'code', 'description', 'discountType', 'discountValue', 'startDate', 'endDate']
    });

    res.status(200).json({ promotions });
  } catch (error) {
    console.error('Ошибка при получении активных акций:', error);
    res.status(500).json({ message: 'Ошибка при получении активных акций' });
  }
};

// Применение промокода
const applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Необходимо указать промокод' });
    }
    
    const currentDate = new Date();
    
    const promotion = await Promotion.findOne({
      where: {
        code,
        isActive: true,
        startDate: { [Op.lte]: currentDate },
        endDate: { [Op.gte]: currentDate },
        [Op.or]: [
          { maxUses: null },
          { usesCount: { [Op.lt]: sequelize.col('maxUses') } }
        ]
      }
    });
    
    if (!promotion) {
      return res.status(404).json({ message: 'Промокод недействителен или срок его действия истек' });
    }

    res.status(200).json({ 
      message: 'Промокод успешно применен',
      promotion: {
        id: promotion.id,
        name: promotion.name,
        code: promotion.code,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue
      }
    });
  } catch (error) {
    console.error('Ошибка при применении промокода:', error);
    res.status(500).json({ message: 'Ошибка при применении промокода' });
  }
};

// [ADMIN] Создание акции
const createPromotion = async (req, res) => {
  try {
    const {
      name, code, description, discountType,
      discountValue, startDate, endDate, maxUses
    } = req.body;

    // Проверка обязательных полей
    if (!name || !code || !discountType || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ 
        message: 'Необходимо указать name, code, discountType, discountValue, startDate и endDate' 
      });
    }

    // Проверка уникальности кода
    const existingPromotion = await Promotion.findOne({
      where: { code }
    });

    if (existingPromotion) {
      return res.status(400).json({ message: 'Промокод с таким кодом уже существует' });
    }

    // Создание новой акции
    const promotion = await Promotion.create({
      name,
      code,
      description,
      discountType,
      discountValue,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxUses,
      usesCount: 0,
      isActive: true
    });

    res.status(201).json({ 
      message: 'Акция успешно создана',
      promotion
    });
  } catch (error) {
    console.error('Ошибка при создании акции:', error);
    res.status(500).json({ message: 'Ошибка при создании акции' });
  }
};

// [ADMIN] Обновление акции
const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, discountType,
      discountValue, startDate, endDate, maxUses
    } = req.body;

    // Поиск акции
    const promotion = await Promotion.findByPk(id);
    
    if (!promotion) {
      return res.status(404).json({ message: 'Акция не найдена' });
    }

    // Обновление данных акции
    if (name) promotion.name = name;
    if (description !== undefined) promotion.description = description;
    if (discountType) promotion.discountType = discountType;
    if (discountValue !== undefined) promotion.discountValue = discountValue;
    if (startDate) promotion.startDate = new Date(startDate);
    if (endDate) promotion.endDate = new Date(endDate);
    if (maxUses !== undefined) promotion.maxUses = maxUses;

    await promotion.save();

    res.status(200).json({ 
      message: 'Акция успешно обновлена',
      promotion
    });
  } catch (error) {
    console.error('Ошибка при обновлении акции:', error);
    res.status(500).json({ message: 'Ошибка при обновлении акции' });
  }
};

// [ADMIN] Активация/деактивация акции
const updatePromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ message: 'Не указан статус активности акции' });
    }
    
    const promotion = await Promotion.findByPk(id);
    
    if (!promotion) {
      return res.status(404).json({ message: 'Акция не найдена' });
    }

    promotion.isActive = isActive;
    await promotion.save();

    res.status(200).json({ 
      message: isActive 
        ? 'Акция активирована' 
        : 'Акция деактивирована',
      promotion: {
        id: promotion.id,
        name: promotion.name,
        isActive: promotion.isActive
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса акции:', error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса акции' });
  }
};

module.exports = {
  getActivePromotions,
  applyPromoCode,
  createPromotion,
  updatePromotion,
  updatePromotionStatus
};
