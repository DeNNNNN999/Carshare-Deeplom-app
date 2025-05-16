const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Car = sequelize.define('Car', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  model: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  brand: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  year: { 
    type: DataTypes.INTEGER,
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  registrationNumber: { 
    type: DataTypes.STRING, 
    unique: true 
  },
  color: { 
    type: DataTypes.STRING 
  },
  fuelType: { 
    type: DataTypes.STRING 
  },
  transmission: { 
    type: DataTypes.STRING 
  },
  category: { 
    type: DataTypes.STRING 
  },
  seats: { 
    type: DataTypes.INTEGER 
  },
  dailyRate: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  hourlyRate: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  minuteRate: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  status: { 
    type: DataTypes.ENUM('available', 'rented', 'maintenance'), 
    defaultValue: 'available' 
  },
  mileage: { 
    type: DataTypes.INTEGER 
  },
  imageUrl: { 
    type: DataTypes.STRING 
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    defaultValue: null
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    defaultValue: null
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = Car;
