const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Conversation = sequelize.define('Conversation', {
  conversation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  start_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'conversations',
  timestamps: false
});

Conversation.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Conversation, { foreignKey: 'user_id' });

module.exports = Conversation;