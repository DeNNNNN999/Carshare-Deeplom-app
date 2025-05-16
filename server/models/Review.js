const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
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
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
  isApproved: {
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

module.exports = Review;
