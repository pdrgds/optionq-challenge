'use strict';

const { test } = require('tap');
const { testWithDb } = require('../test-utils');
const { build } = require('../helper');

const services = require('../../src/services');

testWithDb('tweet service', () => {
  test('should create a new tweet and distribute it to all followers timelines', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');
    const test3 = await services.user.create('test3', 'email3@example.com', '98712');

    await services.friendship.create('test2', 'test1');

    await services.friendship.create('test3', 'test1');

    const tweet1 = await services.tweet.create('test1', 'hello, world!');

    const session = await services.auth.login('email@example.com', '12345');
    const res = await app.inject({
      url: '/tweets/create',
      method: 'POST',
      payload: { text: 'something else' },
      cookies: { session: session.id },
    });

    const tweet2 = JSON.parse(res.body);

    await test2.reload();
    await test3.reload();

    t.ok(test2.timeline.includes(tweet1.id));
    t.ok(test2.timeline.includes(tweet2.id));

    t.ok(test3.timeline.includes(tweet1.id));
    t.ok(test3.timeline.includes(tweet2.id));

    t.end();
  });

  test('retweeted posts should appear on every follower timeline', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '12345');
    const test2 = await services.user.create('test2', 'email2@example.com', '123456');
    const test3 = await services.user.create('test3', 'email3@example.com', '98712');

    await services.friendship.create('test2', 'test1');
    await services.friendship.create('test3', 'test1');

    const tweet1 = await services.tweet.create('test2', 'hello, world!');

    const session = await services.auth.login('email@example.com', '12345');

    await app.inject({
      url: '/tweets/retweet/1',
      method: 'POST',
      cookies: { session: session.id },
    });

    await test2.reload();
    await test3.reload();

    t.ok(test2.timeline.includes(tweet1.id));
    t.ok(test3.timeline.includes(tweet1.id));

    t.end();
  });

  test('search by hashtag should return correct results', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '12345');
    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'hello, world!test');

    const tweet1 = await services.tweet.create('test1', 'hello, #test world!');
    const tweet2 = await services.tweet.create('test1', 'hello, world!#test');

    const session = await services.auth.login('email@example.com', '12345');

    const res = await app.inject({
      url: '/tweets/search?hashtag=test',
      method: 'GET',
      payload: { email: 'email@example.com', inputPassword: '1234' },
      cookies: { session: session.id },
    });

    const result = JSON.parse(res.payload);

    t.same(tweet1.id, result[0].id);
    t.same(tweet2.id, result[1].id);
    t.same(result.length, 2);

    t.end();
  });

  test('search by hashtag shouldn not include tweets by blocked users', async (t) => {
    await services.user.create('test1', 'email@example.com', '12345');
    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'hello, world!test');

    await services.user.create('test2', 'email1@example.com', '123456');
    await services.block.create('test1', 'test2');

    const tweet1 = await services.tweet.create('test1', 'hello, #test world!');
    const tweet2 = await services.tweet.create('test1', 'hello, world!#test');

    await services.tweet.create('test2', 'lorem ipsum');
    const tweet3 = await services.tweet.create('test2', 'lorem ipsum#test');

    const result = await services.tweet.searchHashtag('test', 'test1');

    t.same(tweet1.id, result[0].id);
    t.same(tweet2.id, result[1].id);
    t.same(result.length, 2);

    const result2 = await services.tweet.searchHashtag('test', 'test2');

    t.same(tweet3.id, result2[0].id);
    t.same(result2.length, 1);

    t.end();
  });

  test('count tweets should return correct result', async (t) => {
    const app = build(t);

    await services.user.create('test1', 'email@example.com', '12345');
    await services.tweet.create('test1', 'hello, world!');
    await services.tweet.create('test1', 'hello, world!test');
    await services.tweet.create('test1', 'hello, #test world!');
    await services.tweet.create('test1', 'hello, world!#test');

    const session = await services.auth.login('email@example.com', '12345');
    const res = await app.inject({
      url: '/tweets/count',
      method: 'GET',
      cookies: { session: session.id },
    });

    const count = Number(res.payload);

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

    const session = await services.auth.login('email@example.com', '1234');

    const res = await app.inject({
      url: '/tweets/home_timeline',
      method: 'GET',
      payload: { email: 'email@example.com', inputPassword: '1234' },
      cookies: { session: session.id },
    });

    const test3Timeline = JSON.parse(res.body);

    t.equals(test3Timeline[0].text, 'hello, world!');
    t.equals(test3Timeline[1].text, 'something else');

    t.end();
  });
});
