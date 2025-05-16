const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CarLocation = sequelize.define('CarLocation', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  carId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
}, {
  timestamps: true,
  updatedAt: true,
  createdAt: false
});

module.exports = CarLocation;
