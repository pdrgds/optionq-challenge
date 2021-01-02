'use strict';

const friendshipService = require('../services/friendship');

async function create(req, reply) {
  const targetUserHandle = req.body.userHandle;

  await friendshipService.create('aideus', targetUserHandle);

  reply.code(200);
}

module.exports = { create };
