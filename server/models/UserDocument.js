const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserDocument = sequelize.define('UserDocument', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  documentType: {
    type: DataTypes.ENUM('license', 'passport', 'identity_card', 'other'),
    allowNull: false
  },
  documentNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  documentPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationDate: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  verifiedBy: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    defaultValue: null
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = UserDocument;
