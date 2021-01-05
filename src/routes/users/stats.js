'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Get user information',
  params: {
    userHandle: {
      type: 'string',
    },
  },
  response: {
    200: {
      description: 'User info',
      type: 'object',
      properties: {
        userHandle: {
          type: 'string',
        },
        followersCount: {
          type: 'number',
        },
        followingCount: {
          type: 'number',
        },
      },
    },
  },
};

module.exports = async function (fastify) {
  fastify.addHook('onRequest', controllers.auth.check);
  fastify.get('/user/:userHandle', { schema }, controllers.users.getStats);
};
