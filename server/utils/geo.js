// Функция для расчета расстояния между двумя точками на карте (формула гаверсинуса)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Радиус Земли в км
  
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Расстояние в км
  
  return distance;
};

// Функция для преобразования градусов в радианы
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

// Функция для поиска автомобилей в заданном радиусе от точки
const findCarsInRadius = (latitude, longitude, cars, radius) => {
  return cars.filter(car => {
    // Если у автомобиля нет координат, исключаем его
    if (!car.latitude || !car.longitude) {
      return false;
    }
    
    const distance = calculateDistance(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(car.latitude),
      parseFloat(car.longitude)
    );
    
    return distance <= radius;
  });
};

module.exports = {
  calculateDistance,
  findCarsInRadius,
  toRadians
};
