'use strict';

const userService = require('./user');

async function create(sourceHandle, targetHandle) {
  const sourceUser = await userService.findByHandle(sourceHandle);

  await executeBlockSideEffects(sourceHandle, targetHandle);
  await executeBlockSideEffects(targetHandle, sourceHandle);

  return sourceUser.update({
    blocked: [...sourceUser.blocked, targetHandle],
  });
}

async function executeBlockSideEffects(sourceHandle, targetHandle) {
  const user = await userService.findByHandle(sourceHandle);

  const findHandle = (handle) => handle === targetHandle;

  const isFollowing = user.following.findIndex(findHandle);
  const isFollower = user.followers.findIndex(findHandle);

  if (isFollowing > -1) {
    const newFollowing = user.following.slice();

    newFollowing.splice(isFollowing, 1);

    await user.update({ following: newFollowing });
  }

  if (isFollower > -1) {
    const newFollowers = user.followers.slice();

    newFollowers.splice(isFollower, 1);

    await user.update({ followers: newFollowers });
  }
}

module.exports = { create };
