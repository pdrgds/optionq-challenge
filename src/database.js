'use strict';

const { Sequelize } = require('sequelize');

const dbName = process.env.TWITTER_DB_NAME;
const dbUser = process.env.TWITTER_DB_USER;
const dbPassword = process.env.TWITTER_DB_PASSWORD;
const dbHost = process.env.TWITTER_HOST;

module.exports = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});
