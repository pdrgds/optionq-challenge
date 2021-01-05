'use strict';

const favoriteService = require('../services/favorite');

async function create(req, reply) {
  const tweetId = req.body.tweetId;

  await favoriteService.create(req.loggedUserHandle, tweetId);

  reply.code(200).send();
}

module.exports = { create };
