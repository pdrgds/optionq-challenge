'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Create a new tweet',
  body: {
    type: 'object',
    properties: {
      text: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      description: 'The newly created tweet',
      type: 'object',
      properties: {
        text: {
          type: 'string',
        },
        id: {
          type: 'number',
        },
        userHandle: {
          type: 'string',
        },
      },
    },
  },
};

module.exports = async function (fastify) {
  fastify.addHook('onRequest', controllers.auth.check);
  fastify.post('/create', { schema }, controllers.tweets.create);
};
