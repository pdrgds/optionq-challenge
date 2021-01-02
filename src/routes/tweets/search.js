'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Search tweets by hashtag',
  querystring: {
    hashtag: { type: 'string' },
  },
  response: {
    200: {
      description: 'An array containing the search results',
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
  fastify.get('/search', { schema }, controllers.tweets.searchByHashtag);
};
