'use strict';

const userService = require('../services/user');

async function getStats(req, reply) {
  const stats = await userService.getStats(req.params.userHandle);

  reply.code(200).send(stats);
}

module.exports = { getStats };
