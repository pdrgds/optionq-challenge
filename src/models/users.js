'use strict';

const { DataTypes } = require('sequelize');
const database = require('../database');

module.exports = database.define('User', {
  handle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  followers: {
    type: DataTypes.JSON,
  },
  followersCount: {
    type: DataTypes.INTEGER,
  },
  following: {
    type: DataTypes.JSON,
  },
  followingCount: {
    type: DataTypes.INTEGER,
  },
  tweets: {
    type: DataTypes.JSON,
  },
  timeline: {
    type: DataTypes.JSON,
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
  blocked: {
    type: DataTypes.JSON,
  },
  isBlockedBy: {
    type: DataTypes.JSON,
  },
  favorites: {
    type: DataTypes.JSON,
  },
});
