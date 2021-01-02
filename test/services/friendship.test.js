'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');

const services = require('../../src/services');

testWithDb('user service', () => {
  test('user can follow another user', async (t) => {
    const test1 = await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');

    await services.friendship.create('test1', 'test2');

    await test1.reload();
    await test2.reload();

    t.ok(test1.following.includes('test2'));
    t.ok(test2.followers.includes('test1'));

    t.end();
  });
});
