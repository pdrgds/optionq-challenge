'use strict';

const controllers = require('../../controllers');

const schema = {
  description: 'Given a session ID, logs user out',
  response: {
    200: {
      description: 'Successful logout',
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Session id',
        },
      },
    },
  },
};

module.exports = async function (fastify) {
  fastify.get('/logout', { schema }, controllers.auth.logout);
};
