'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Follow another user',
  body: {
    type: 'object',
    properties: {
      targetUserHandle: {
        type: 'string',
        description: 'the user the logged user should follow',
      },
    },
  },
  response: {
    200: {
      description: 'Success message',
      type: 'string',
    },
  },
};

module.exports = async function (fastify) {
  fastify.addHook('onRequest', controllers.auth.check);
  fastify.post('/create', { schema }, controllers.friendship.create);
};
