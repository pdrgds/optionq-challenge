const { test, beforeEach, tearDown } = require("tap");
const sequelize = require("../src/database");

function testWithDb(description, testFn) {
  beforeEach(async () => {
    await sequelize.drop();
    await sequelize.sync();
  });

  tearDown(async () => {
    await sequelize.close();
  });

  testFn();
}

module.exports = { testWithDb };
