'use strict';

const userService = require('../services/user');

async function create(userHandle, tweetId) {
  const user = await userService.findByHandle(userHandle);

  return user.update({ favorites: [...user.favorites, tweetId] });
}

module.exports = { create };
