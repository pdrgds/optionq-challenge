'use strict';

const bcrypt = require('bcrypt');

const models = require('../models');
const sessionService = require('../services');

async function login(email, inputPassword) {
  const user = await models.users.findOne({ where: { email } });

  if (!user) {
    throw new Error("user doesn't exist");
  }

  const isPasswordCorrect = await bcrypt.compare(inputPassword, user.password);

  if (!isPasswordCorrect) {
    throw new Error('wrong password');
  }

  const session = await sessionService.create(user.handle);

  return session;
}

function logout(sessionId) {
  return sessionService.destroy(sessionId);
}

module.exports = { login, logout };
