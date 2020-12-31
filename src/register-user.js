'use strict';

const readline = require('readline');

const services = require('../src/services');

async function main() {
  const [question, close] = useQuestion();

  const email = await question('Email:\n');

  const username = await question('Username:\n');

  const inputPassword = await question('Password:\n');

  close();

  await services.user.create(username, email, inputPassword);
}

function useQuestion() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const promiseBasedQuestion = (question) => new Promise((resolve) => rl.question(question, resolve));

  return [promiseBasedQuestion, () => rl.close()];
}

main();
