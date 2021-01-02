'use strict';

const { Sequelize } = require('sequelize');
const userService = require('./user');
const models = require('../models');

async function create(handle, text) {
  const tweet = await models.tweets.create({ userHandle: handle, text });

  await distributeTweet(handle, tweet.id);

  return tweet;
}

function retweet(handle, tweetId) {
  return distributeTweet(handle, tweetId);
}

function searchHashtag(tag) {
  return models.tweets.findAll({
    where: { text: { [Sequelize.Op.like]: `%#${tag}%` } },
  });
}

async function distributeTweet(handle, tweetId) {
  const user = await userService.findByHandle(handle);

  await user.update({
    tweets: [...user.tweets, tweetId],
    timeline: [...user.timeline, tweetId],
  });

  const followers = await models.users.findAll({
    where: { handle: user.followers },
  });

  return Promise.all(followers.map((follower) => follower.update({ timeline: [...follower.timeline, tweetId] })));
}

function count() {
  return models.tweets.count();
}

async function getTimeline(handle) {
  const user = await userService.findByHandle(handle);

  return models.tweets.findAll({ where: { id: user.timeline } });
}

module.exports = { create, retweet, searchHashtag, count, getTimeline };
