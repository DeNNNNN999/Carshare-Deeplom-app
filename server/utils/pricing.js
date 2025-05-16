// Функция для расчета общей стоимости аренды
const calculateRentalCost = (rentalPlan, car, startDate, endDate, promoCode = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const durationMs = end - start;
  
  let durationUnits;
  let ratePerUnit;
  
  // Определяем тип длительности и ставку на основе типа тарифного плана
  switch (rentalPlan.durationType) {
    case 'minute':
      durationUnits = durationMs / (1000 * 60);
      ratePerUnit = car.minuteRate;
      break;
    case 'hour':
      durationUnits = durationMs / (1000 * 60 * 60);
      ratePerUnit = car.hourlyRate;
      break;
    case 'day':
      durationUnits = durationMs / (1000 * 60 * 60 * 24);
      ratePerUnit = car.dailyRate;
      break;
    case 'week':
      durationUnits = durationMs / (1000 * 60 * 60 * 24 * 7);
      ratePerUnit = car.dailyRate * 7;
      break;
    case 'month':
      // Приблизительно месяц как 30 дней
      durationUnits = durationMs / (1000 * 60 * 60 * 24 * 30);
      ratePerUnit = car.dailyRate * 30;
      break;
    default:
      throw new Error('Неизвестный тип длительности аренды');
  }
  
  // Округляем количество единиц времени до десятых (для удобства)
  durationUnits = Math.ceil(durationUnits * 10) / 10;
  
  // Базовая стоимость из тарифного плана + стоимость за единицы времени
  let totalCost = parseFloat(rentalPlan.basePrice) + (durationUnits * parseFloat(ratePerUnit));
  
  // Применяем скидку тарифного плана, если она есть
  if (rentalPlan.discountPercent > 0) {
    const discountAmount = (totalCost * parseFloat(rentalPlan.discountPercent)) / 100;
    totalCost -= discountAmount;
  }
  
  // Применяем промокод, если он предоставлен и активен
  if (promoCode && promoCode.isActive) {
    if (promoCode.discountType === 'percentage') {
      const promoDiscountAmount = (totalCost * parseFloat(promoCode.discountValue)) / 100;
      totalCost -= promoDiscountAmount;
    } else if (promoCode.discountType === 'fixed_amount') {
      totalCost -= parseFloat(promoCode.discountValue);
    }
  }
  
  // Убедимся, что стоимость не отрицательная
  totalCost = Math.max(totalCost, 0);
  
  // Округляем до 2 знаков после запятой
  return parseFloat(totalCost.toFixed(2));
};

module.exports = {
  calculateRentalCost
};
