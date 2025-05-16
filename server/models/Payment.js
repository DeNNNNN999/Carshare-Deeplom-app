const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  bookingId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: { 
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  paymentMethod: { 
    type: DataTypes.STRING 
  },
  transactionId: { 
    type: DataTypes.STRING 
  },
  status: { 
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    defaultValue: 'pending'
  },
  paymentDate: { 
    type: DataTypes.DATE 
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
});

module.exports = Payment;
