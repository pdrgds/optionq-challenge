'use strict';

const bcrypt = require('bcrypt');

const models = require('../models');

async function create(handle, email, inputPassword) {
  const password = await bcrypt.hash(inputPassword, 10);

  return models.users.create({
    handle,
    followers: [],
    followersCount: 0,
    following: [],
    followingCount: 0,
    timeline: [],
    tweets: [],
    email,
    password,
    blocked: [],
    isBlockedBy: [],
    favorites: [],
  });
}

function getFollowingCount(handle) {
  return findByHandle(handle).then((user) => user.followingCount);
}

function getStats(handle) {
  return models.users.findOne({ where: { handle }, attributes: ['followersCount', 'followingCount'] });
}

function findByHandle(handle) {
  return models.users.findOne({ where: { handle } });
}

module.exports = {
  create,
  findByHandle,
  getFollowingCount,
  getStats,
};
