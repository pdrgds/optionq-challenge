'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'user login',
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
  response: {
    200: {
      description: 'successful login',
      type: 'string',
    },
  },
};

module.exports = async function (fastify, opts) {
  fastify.post('/login', { schema }, controllers.user.login);
};
