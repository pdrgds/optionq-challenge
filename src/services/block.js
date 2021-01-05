'use strict';

const userService = require('./user');

async function create(sourceHandle, targetHandle) {
  const sourceUser = await userService.findByHandle(sourceHandle);
  const targetUser = await userService.findByHandle(targetHandle);

  const sourceUserChanges = await executeBlockSideEffects(sourceUser, targetHandle);
  const targetUserChanges = await executeBlockSideEffects(targetUser, sourceHandle);

  await targetUser.update({
    ...targetUserChanges,
    isBlockedBy: [...targetUser.isBlockedBy, sourceHandle],
  });

  return sourceUser.update({
    ...sourceUserChanges,
    blocked: [...sourceUser.blocked, targetHandle],
  });
}

function executeBlockSideEffects(user, targetHandle) {
  let changes = {};

  const findHandle = (handle) => handle === targetHandle;

  const isFollowing = user.following.findIndex(findHandle);
  const isFollower = user.followers.findIndex(findHandle);

  if (isFollowing > -1) {
    const newFollowing = user.following.slice();

    newFollowing.splice(isFollowing, 1);

    changes = { ...changes, following: newFollowing };
  }

  if (isFollower > -1) {
    const newFollowers = user.followers.slice();

    newFollowers.splice(isFollower, 1);

    changes = { ...changes, followers: newFollowers };
  }

  return changes;
}

module.exports = { create };
