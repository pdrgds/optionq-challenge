"use strict";

const uuid = require("uuid")
const { test } = require("tap");

const services = require("../../src/services");
const { testWithDb } = require("../test-utils");

testWithDb("session service", () => {
  test("a new session has a valid id", async (t) => {
    const newSession = await services.session.create("test1");

    t.ok(uuid.validate(newSession.id))

    t.end();
  });
});
