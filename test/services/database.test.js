'use strict';

const database = require('../src/database');

const { test } = require('tap');

test('can connect to database', async (t) => {
  await database.authenticate();

  await database.close();

  t.end();
});
