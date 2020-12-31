const models = require('../models');
const { v4: uuidv4 } = require('uuid');

function create(userHandle) {
  const id = uuidv4();

  return models.sessions.create({ id, userHandle });
}

function check(id) {
  return models.sessions.findOne({ where: { id } });
}

function destroy(id) {
  return models.sessions.destroy({ where: { id } });
}

module.exports = { create, check, destroy };
