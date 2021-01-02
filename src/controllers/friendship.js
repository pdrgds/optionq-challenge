'use strict';

const friendshipService = require('../services/friendship');

async function create(req, reply) {
  const targetUserHandle = req.body.targetUserHandle;
  const sourceUserHandle = req.loggedUserHandle;

  await friendshipService.create(sourceUserHandle, targetUserHandle);

  reply.code(200).send();
}

module.exports = { create };
