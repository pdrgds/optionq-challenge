'use strict';

const bcrypt = require('bcrypt');

const models = require('../models');
const sessionService = require('./session');

async function follow(sourceHandle, targetHandle) {
  const sourceUser = await findByHandle(sourceHandle);
  const targetUser = await findByHandle(targetHandle);

  const updatedSoure = sourceUser.update({
    following: [...sourceUser.following, targetHandle],
    followingCount: sourceUser.followingCount + 1,
  });

  const updatedTarget = targetUser.update({
    followers: [...targetUser.followers, sourceHandle],
    followersCount: targetUser.followersCount + 1,
  });

  return Promise.all([updatedSoure, updatedTarget]);
}

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
  });
}

async function getTimeline(handle) {
  const user = await findByHandle(handle);

  return models.tweets.findAll({ where: { id: user.timeline } });
}

function getFollowingCount(handle) {
  return findByHandle(handle).then((user) => user.followingCount);
}

function findByHandle(handle) {
  return models.users.findOne({ where: { handle } });
}

async function login(email, inputPassword) {
  const user = await models.users.findOne({ where: { email } });

  if (!user) {
    throw new Error('user doesn\'t exist');
  }

  const isPasswordCorrect = await bcrypt.compare(inputPassword, user.password);

  if (!isPasswordCorrect) {
    throw new Error('wrong password');
  }

  const session = await sessionService.create(user.handle);

  return session;
}

function logout(sessionId) {
  return sessionService.destroy(sessionId);
}

module.exports = {
  follow,
  create,
  findByHandle,
  getTimeline,
  getFollowingCount,
  login,
  logout,
};
