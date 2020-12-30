const { DataTypes } = require("sequelize");
const database = require("../database");

module.exports = database.define("Sessions", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userHandle: {
      type: DataTypes.STRING
  }
});
