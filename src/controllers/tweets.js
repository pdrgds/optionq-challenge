'use strict';

const services = require('../services');

async function getTimeline(req, reply) {
  const userHandle = req.loggedUserHandle;

  const timeline = await services.tweet.getTimeline(userHandle);

  reply.code(200).send(timeline);
}

module.exports = { getTimeline };
