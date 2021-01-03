'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Retweet a tweet',
  params: {
    tweetId: {
      type: 'number',
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
  fastify.post('/retweet/:tweetId', { schema }, controllers.tweets.retweet);
};
