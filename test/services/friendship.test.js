'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('friendship service', () => {
  test('user can follow another user', async (t) => {
    const app = build(t);

    const test1 = await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');

    const session = await services.auth.login('email@example.com', '12345');

    await app.inject({
      url: '/friendship/create',
      method: 'POST',
      payload: { targetUserHandle: 'test2' },
      cookies: { session: session.id },
    });

    await test1.reload();
    await test2.reload();

    t.ok(test1.following.includes('test2'));
    t.ok(test2.followers.includes('test1'));

    t.end();
  });

  test("user can't follow another user if he's blocked", async (t) => {
    const test1 = await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');

    await services.block.create('test2', 'test1');

    await t.rejects(() => services.friendship.create('test1', 'test2'), "You're blocked by this user!");

    t.end();
  });
});
