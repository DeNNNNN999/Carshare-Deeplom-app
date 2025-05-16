const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  firstName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  lastName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  phone: { 
    type: DataTypes.STRING,
    validate: {
      is: /^[+]?[0-9\s().\-]{10,18}$/
    }
  },
  birthDate: { 
    type: DataTypes.DATE 
  },
  licenseNumber: { 
    type: DataTypes.STRING 
  },
  licenseIssueDate: { 
    type: DataTypes.DATE 
  },
  licenseExpiryDate: { 
    type: DataTypes.DATE 
  },
  role: { 
    type: DataTypes.ENUM('client', 'manager', 'admin'), 
    defaultValue: 'client' 
  },
  isVerified: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  status: { 
    type: DataTypes.ENUM('active', 'blocked', 'deleted'), 
    defaultValue: 'active' 
  },
  createdAt: { 
    type: DataTypes.DATE 
  },
  updatedAt: { 
    type: DataTypes.DATE 
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
