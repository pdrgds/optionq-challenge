'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');
const { friendship } = require('../../src/services');

testWithDb('block service', () => {
  test('a block should completely eliminate a friendship between users', async (t) => {
    const app = build(t);

    const test1 = await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');

    await friendship.create('test1', 'test2');
    await friendship.create('test2', 'test1');

    const session = await services.auth.login('email@example.com', '12345');

    await app.inject({
      url: '/block/create',
      method: 'POST',
      payload: { targetUserHandle: 'test2' },
      cookies: { session: session.id },
    });

    await test1.reload();
    await test2.reload();

    t.ok(test2.isBlockedBy.includes('test1'));
    t.notOk(test1.following.includes('test2'));
    t.notOk(test2.followers.includes('test1'));

    t.end();
  });
});
