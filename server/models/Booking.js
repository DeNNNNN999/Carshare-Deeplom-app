const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  carId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rentalPlanId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  startDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  endDate: { 
    type: DataTypes.DATE, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled'), 
    defaultValue: 'pending' 
  },
  totalCost: { 
    type: DataTypes.DECIMAL(10, 2) 
  },
  initialMileage: { 
    type: DataTypes.INTEGER 
  },
  finalMileage: { 
    type: DataTypes.INTEGER 
  },
  promoCodeId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = Booking;
