'use strict';

const userService = require('./user');

async function create(sourceHandle, targetHandle) {
  const sourceUser = await userService.findByHandle(sourceHandle);

  const targetUser = await userService.findByHandle(targetHandle);

  if (targetUser.blocked.includes(sourceHandle)) {
    throw new Error("You're blocked by this user!");
  }

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

module.exports = { create };
