'use strict';

const services = require('../services');

async function getTimeline(req, reply) {
  const userHandle = req.loggedUserHandle;

  const timeline = await services.tweet.getTimeline(userHandle);

  reply.code(200).send(timeline);
}

async function searchByHashtag(req, reply) {
  const hashtag = req.query.hashtag;

  const searchResult = await services.tweet.searchHashtag(hashtag);

  reply.code(200).send(searchResult);
}

module.exports = { getTimeline, searchByHashtag };
