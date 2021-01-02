'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');

const services = require('../../src/services');

testWithDb('user service', () => {
  test('following count should return correct value', async (t) => {
    await services.user.create('test1', 'email@example.com', '1234');
    await services.user.create('test2', 'email2@example.com', '5678');
    await services.user.create('test3', 'email3@example.com', '98712');

    await services.friendship.create('test1', 'test2');
    await services.friendship.create('test1', 'test3');

    const followingCount = await services.user.getFollowingCount('test1');

    t.same(followingCount, 2);

    t.end();
  });
});
