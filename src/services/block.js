'use strict';

const userService = require('./user');

async function create(sourceHandle, targetHandle) {
  const sourceUser = await userService.findByHandle(sourceHandle);
  const targetUser = await userService.findByHandle(targetHandle);

  await executeBlockSideEffects(sourceUser, targetHandle);
  await executeBlockSideEffects(targetUser, sourceHandle);

  await targetUser.update({
    isBlockedBy: [...targetUser.isBlockedBy, sourceHandle],
  });

  return sourceUser.update({
    blocked: [...sourceUser.blocked, targetHandle],
  });
}

async function executeBlockSideEffects(user, targetHandle) {
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
