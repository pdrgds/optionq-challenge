'use strict';

const path = require('path');
const AutoLoad = require('fastify-autoload');
const cookie = require('fastify-cookie');
const fastifySwagger = require('fastify-swagger');

const database = require('./database');

module.exports = async function (fastify, opts) {
  // Place here your custom code!
  await database.sync();

  fastify.register(cookie);

  fastify.register(fastifySwagger, {
    exposeRoute: true,
    routePrefix: '/docs',
    swagger: {
      info: {
        title: 'Twitter',
        description: 'Twitter-like API',
        version: '0.0.1',
      },
    },
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  // fastify.register(AutoLoad, {
  //   dir: path.join(__dirname, 'plugins'),
  //   options: Object.assign({}, opts),
  // });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts),
  });
};
