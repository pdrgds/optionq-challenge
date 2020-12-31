'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('user service', () => {
  test('user can follow another user', async (t) => {
    const test1 = await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');

    await services.user.follow('test1', 'test2');

    await test1.reload();
    await test2.reload();

    t.ok(test1.following.includes('test2'));
    t.ok(test2.followers.includes('test1'));

    t.end();
  });

  test('user can retrieve its timeline', async (t) => {
    await services.user.create('test1', 'email@example.com', '1234');
    await services.user.create('test2', 'email2@example.com', '5678');
    await services.user.create('test3', 'email3@example.com', '98712');

    await services.user.follow('test2', 'test1');
    await services.user.follow('test3', 'test1');

    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'something else');

    const test3Timeline = await services.user.getTimeline('test3');

    t.equals(test3Timeline[0].text, 'hello, world!');
    t.equals(test3Timeline[1].text, 'something else');

    t.end();
  });

  test('following count should return correct value', async (t) => {
    await services.user.create('test1', 'email@example.com', '1234');
    await services.user.create('test2', 'email2@example.com', '5678');
    await services.user.create('test3', 'email3@example.com', '98712');

    await services.user.follow('test1', 'test2');
    await services.user.follow('test1', 'test3');

    const followingCount = await services.user.getFollowingCount('test1');

    t.same(followingCount, 2);

    t.end();
  });

  test('should login and logout correctly with an existing user', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '1234');

    const res = await app.inject({
      url: '/user/login',
      method: 'POST',
      payload: { email: 'email@example.com', inputPassword: '1234' },
    });

    const [cookie] = res.cookies;

    const session = await services.session.check(cookie.value);

    t.same(session.userHandle, 'test1');

    await services.user.logout(session.id);

    const sameSession = await services.session.check(session.id);

    t.notOk(sameSession);

    t.end();
  });
});
