'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('tweet service', () => {
  test('should create a new tweet and distribute it to all followers timelines', async (t) => {
    await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');
    const test3 = await services.user.create('test3', 'email3@example.com', '98712');

    await services.friendship.create('test2', 'test1');
    await services.friendship.create('test3', 'test1');

    const tweet1 = await services.tweet.create('test1', 'hello, world!');
    const tweet2 = await services.tweet.create('test1', 'something else');

    await test2.reload();
    await test3.reload();

    t.ok(test2.timeline.includes(tweet1.id));
    t.ok(test2.timeline.includes(tweet2.id));

    t.ok(test3.timeline.includes(tweet1.id));
    t.ok(test3.timeline.includes(tweet2.id));

    t.end();
  });

  test('search by hashtag should return correct results', async (t) => {
    await services.user.create('test1', 'email@example.com', '12345');
    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'hello, world!test');

    const tweet1 = await services.tweet.create('test1', 'hello, #test world!');
    const tweet2 = await services.tweet.create('test1', 'hello, world!#test');

    const result = await services.tweet.searchHashtag('test');

    t.same(tweet1.id, result[0].id);
    t.same(tweet2.id, result[1].id);
    t.same(result.length, 2);

    t.end();
  });

  test('count tweets should return correct result', async (t) => {
    await services.user.create('test1', 'email@example.com', '12345');
    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'hello, world!test');
    await services.tweet.create('test1', 'hello, #test world!');
    await services.tweet.create('test1', 'hello, world!#test');

    const count = await services.tweet.count();

    t.same(count, 4);

    t.end();
  });

  test('user can retrieve its timeline', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '1234');
    await services.user.create('test2', 'email2@example.com', '5678');
    await services.user.create('test3', 'email3@example.com', '98712');

    await services.friendship.create('test2', 'test1');
    await services.friendship.create('test3', 'test1');

    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'something else');

    const res = await app.inject({
      url: '/tweets/test1/home_timeline',
      method: 'GET',
      payload: { email: 'email@example.com', inputPassword: '1234' },
    });

    const test3Timeline = JSON.parse(res.body);

    t.equals(test3Timeline[0].text, 'hello, world!');
    t.equals(test3Timeline[1].text, 'something else');

    t.end();
  });
});
