const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Promotion = sequelize.define('Promotion', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed_amount'),
    allowNull: false
  },
  discountValue: {
    type: DataTypes.DECIMAL(10, 2),
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
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  maxUses: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  usesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = Promotion;
