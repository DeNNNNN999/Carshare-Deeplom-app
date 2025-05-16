const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RentalPlan = sequelize.define('RentalPlan', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  description: { 
    type: DataTypes.TEXT 
  },
  durationType: { 
    type: DataTypes.ENUM('minute', 'hour', 'day', 'week', 'month') 
  },
  basePrice: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  pricePerUnit: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  minDuration: { 
    type: DataTypes.INTEGER 
  },
  maxDuration: { 
    type: DataTypes.INTEGER 
  },
  discountPercent: { 
    type: DataTypes.DECIMAL(5, 2), 
    defaultValue: 0 
  },
  isActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = RentalPlan;
