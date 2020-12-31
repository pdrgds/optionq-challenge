'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Given an user handle, return its timeline',
  params: {
    userHandle: {
      type: 'string',
      description: 'User handle e.g. @pedroguedes',
    },
  },
  response: {
    200: {
      description: 'Successful logout',
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
  fastify.get('/:user/timeline', { schema }, controllers.user.getTimeline);
};
