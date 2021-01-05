'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Favorite a tweet',
  body: {
    type: 'object',
    properties: {
      tweetId: {
        type: 'number',
        description: 'The id of the tweet that should be favorited',
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
  fastify.post('/create', { schema }, controllers.favorite.create);
};
