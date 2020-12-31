'use strict';

const services = require('../services');

async function login(req, reply) {
  const email = req.body.email;
  const inputPassword = req.body.inputPassword;

  const session = await services.user.login(email, inputPassword);

  reply
    .setCookie('session', session.id, {
      path: '/',
    })
    .send();
}

async function logout(req, reply) {
  const sessionId = req.body.sessionId;

  const session = await services.user.logout(sessionId);

  reply.code(200).send(session);
}

async function getTimeline(req, reply) {
  const userHandle = req.params.user;

  const timeline = await services.user.getTimeline(userHandle);

  reply.code(200).send(timeline);
}

module.exports = { login, logout, getTimeline };
