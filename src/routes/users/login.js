'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Given an email and password, sets a session ID as a cookie',
  body: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
      },
      inputPassword: { type: 'string' },
    },
  },
};

module.exports = async function (fastify, opts) {
  fastify.post('/login', { schema }, controllers.users.login);
};
