const { RentalPlan } = require('../models');

// Получение списка доступных тарифных планов
const getAllRentalPlans = async (req, res) => {
  try {
    const rentalPlans = await RentalPlan.findAll({
      where: { isActive: true },
      order: [['basePrice', 'ASC']]
    });

    res.status(200).json({ rentalPlans });
  } catch (error) {
    console.error('Ошибка при получении списка тарифных планов:', error);
    res.status(500).json({ message: 'Ошибка при получении списка тарифных планов' });
  }
};

// Получение информации о конкретном тарифном плане
const getRentalPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rentalPlan = await RentalPlan.findByPk(id);
    
    if (!rentalPlan) {
      return res.status(404).json({ message: 'Тарифный план не найден' });
    }

    res.status(200).json({ rentalPlan });
  } catch (error) {
    console.error('Ошибка при получении информации о тарифном плане:', error);
    res.status(500).json({ message: 'Ошибка при получении информации о тарифном плане' });
  }
};

// [ADMIN] Создание нового тарифного плана
const createRentalPlan = async (req, res) => {
  try {
    const {
      name, description, durationType, basePrice,
      pricePerUnit, minDuration, maxDuration, discountPercent
    } = req.body;

    // Проверка уникальности имени плана
    const existingPlan = await RentalPlan.findOne({
      where: { name }
    });

    if (existingPlan) {
      return res.status(400).json({ message: 'Тарифный план с таким названием уже существует' });
    }

    // Создание нового тарифного плана
    const rentalPlan = await RentalPlan.create({
      name,
      description,
      durationType,
      basePrice,
      pricePerUnit,
      minDuration,
      maxDuration,
      discountPercent: discountPercent || 0,
      isActive: true
    });

    res.status(201).json({ 
      message: 'Тарифный план успешно создан',
      rentalPlan
    });
  } catch (error) {
    console.error('Ошибка при создании тарифного плана:', error);
    res.status(500).json({ message: 'Ошибка при создании тарифного плана' });
  }
};

// [ADMIN] Обновление тарифного плана
const updateRentalPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, durationType, basePrice,
      pricePerUnit, minDuration, maxDuration, discountPercent
    } = req.body;

    // Поиск тарифного плана
    const rentalPlan = await RentalPlan.findByPk(id);
    
    if (!rentalPlan) {
      return res.status(404).json({ message: 'Тарифный план не найден' });
    }

    // Проверка уникальности имени плана (если оно изменилось)
    if (name && name !== rentalPlan.name) {
      const existingPlan = await RentalPlan.findOne({
        where: { name }
      });

      if (existingPlan && existingPlan.id !== parseInt(id)) {
        return res.status(400).json({ message: 'Тарифный план с таким названием уже существует' });
      }
    }

    // Обновление данных тарифного плана
    if (name) rentalPlan.name = name;
    if (description !== undefined) rentalPlan.description = description;
    if (durationType) rentalPlan.durationType = durationType;
    if (basePrice !== undefined) rentalPlan.basePrice = basePrice;
    if (pricePerUnit !== undefined) rentalPlan.pricePerUnit = pricePerUnit;
    if (minDuration !== undefined) rentalPlan.minDuration = minDuration;
    if (maxDuration !== undefined) rentalPlan.maxDuration = maxDuration;
    if (discountPercent !== undefined) rentalPlan.discountPercent = discountPercent;

    await rentalPlan.save();

    res.status(200).json({ 
      message: 'Тарифный план успешно обновлен',
      rentalPlan
    });
  } catch (error) {
    console.error('Ошибка при обновлении тарифного плана:', error);
    res.status(500).json({ message: 'Ошибка при обновлении тарифного плана' });
  }
};

// [ADMIN] Активация/деактивация тарифного плана
const updateRentalPlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ message: 'Не указан статус активности тарифного плана' });
    }
    
    const rentalPlan = await RentalPlan.findByPk(id);
    
    if (!rentalPlan) {
      return res.status(404).json({ message: 'Тарифный план не найден' });
    }

    rentalPlan.isActive = isActive;
    await rentalPlan.save();

    res.status(200).json({ 
      message: isActive 
        ? 'Тарифный план активирован' 
        : 'Тарифный план деактивирован',
      rentalPlan: {
        id: rentalPlan.id,
        name: rentalPlan.name,
        isActive: rentalPlan.isActive
      }
    });
  } catch (error) {
    console.error('Ошибка при обновлении статуса тарифного плана:', error);
    res.status(500).json({ message: 'Ошибка при обновлении статуса тарифного плана' });
  }
};

module.exports = {
  getAllRentalPlans,
  getRentalPlanById,
  createRentalPlan,
  updateRentalPlan,
  updateRentalPlanStatus
};
