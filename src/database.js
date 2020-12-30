const {Sequelize} = require("sequelize")

module.exports = new Sequelize('twitter', 'root', '', {
    host: 'localhost',
    dialect: "mysql",
    logging: false
  });
