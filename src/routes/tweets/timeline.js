'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Return the logged user timeline',
  response: {
    200: {
      description: 'Requested user tweets',
      type: 'array',
      items: {
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
  },
};

module.exports = async function (fastify) {
  fastify.addHook('onRequest', controllers.auth.check);
  fastify.get('/home_timeline', { schema }, controllers.tweets.getTimeline);
};
