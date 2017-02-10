const Sequelize = require('sequelize');
const connection = require('../pgConnection');

const User = connection.define('users', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

connection.sync();

module.exports = User;
