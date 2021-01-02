'use strict';

const services = require('../services');

async function login(req, reply) {
  const email = req.body.email;
  const inputPassword = req.body.inputPassword;

  const session = await services.auth.login(email, inputPassword);

  reply
    .setCookie('session', session.id, {
      path: '/',
    })
    .send();
}

async function logout(req, reply) {
  const sessionId = req.body.sessionId;

  const session = await services.auth.logout(sessionId);

  reply.code(200).send(session);
}

module.exports = { login, logout };
