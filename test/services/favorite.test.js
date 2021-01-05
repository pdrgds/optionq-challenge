'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('block service', () => {
  test('should add tweet ids to favorite list', async (t) => {
    const app = build(t);

    const test1 = await services.user.create('test1', 'email@example.com', '12345');

    const session = await services.auth.login('email@example.com', '12345');

    await app.inject({
      url: '/favorite/create',
      method: 'POST',
      payload: { tweetId: '1' },
      cookies: { session: session.id },
    });

    await test1.reload();

    t.ok(test1.favorites.includes(1));

    t.end();
  });
});
