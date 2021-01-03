'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Get the total of tweets',
  response: {
    200: {
      description: 'The total of tweets ever created',
      type: 'number',
    },
  },
};

module.exports = async function (fastify) {
  fastify.addHook('onRequest', controllers.auth.check);
  fastify.get('/count', { schema }, controllers.tweets.count);
};
