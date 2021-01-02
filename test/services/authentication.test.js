'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('authentication service', () => {
  test('should login and logout correctly with an existing user', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '1234');

    const res = await app.inject({
      url: '/auth/login',
      method: 'POST',
      payload: { email: 'email@example.com', inputPassword: '1234' },
    });

    const [cookie] = res.cookies;

    const session = await services.session.check(cookie.value);

    t.same(session.userHandle, 'test1');

    await app.inject({
      url: '/auth/logout',
      method: 'POST',
      payload: { sessionId: session.id },
    });

    const sameSession = await services.session.check(session.id);

    t.notOk(sameSession);

    t.end();
  });
});
