'use strict';

module.exports = async function (fastify) {
  fastify.register(require('./login'));
  fastify.register(require('./logout'));
  fastify.register(require('./timeline'));
};
