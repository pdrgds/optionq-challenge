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
  const sessionId = req.cookies.session;

  const session = await services.auth.logout(sessionId);

  reply.code(200).send(session);
}

async function check(req, reply) {
  const sessionId = req.cookies.session || '';

  const session = await services.session.check(sessionId);

  if (!session) {
    reply.code(401).send();
  } else {
    req.loggedUserHandle = session.userHandle;
  }
}

module.exports = { login, logout, check };
