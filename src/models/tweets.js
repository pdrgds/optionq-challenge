'use strict';

const { DataTypes } = require('sequelize');
const database = require('../database');

module.exports = database.define('Tweets', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userHandle: {
    type: DataTypes.STRING,
  },
  text: {
    type: DataTypes.STRING,
  },
});
