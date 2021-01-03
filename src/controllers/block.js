'use strict';

const blockService = require('../services/block');

async function create(req, reply) {
  const targetUserHandle = req.body.targetUserHandle;
  const sourceUserHandle = req.loggedUserHandle;

  await blockService.create(sourceUserHandle, targetUserHandle);

  reply.code(200).send();
}

module.exports = { create };
