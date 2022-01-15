const fs = require('fs');
const os = require('os');
const path = require('path');
const { performance } = require('perf_hooks');
const { colored, pad } = require('./lib/utils');

function getSolution(title) {
  try {
    const script = fs.readFileSync(path.join(title, 'index.js')).toString();
    eval(script);
    return solution;
  } catch (e) {
    return undefined;
  }
}

function getTest(title) {
  try {
    const testFile = fs.readFileSync(path.join(title, 'test.txt')).toString();
    if (!testFile.length) throw Error();

    const lines = testFile.split(os.EOL);
    if (!lines[lines.length - 1].length) lines.pop();

    const cases = lines.map((line) => line.split('\\').map(JSON.parse));
    return cases;
  } catch (e) {
    return undefined;
  }
}

function execute(solution, args, expected) {
  const result = {
    retval: undefined,
    success: false,
    err: false,
    duration: 0,
  };

  const start = performance.now();
  try {
    result.retval = solution(...args);
  } catch (e) {
    result.retval = e;
    result.success = false;
    result.err = true;
  }

  result.duration = performance.now() - start;
  if (!result.err) {
    result.success = JSON.stringify(result.retval) === JSON.stringify(expected);
  }

  return result;
}

function runTest(solution, test, index) {
  const args = test.slice(0, test.length - 1);
  const expected = test[test.length - 1];

  console.log(colored(`[TEST ${index + 1}]`, 'green'));
  console.log(`${pad('INPUT', 10)}:`, args.map(JSON.stringify).join(', '));
  console.log(`${pad('EXPECTED', 10)}:`, JSON.stringify(expected));

  const { retval, success, err, duration } = execute(solution, args, expected);

  let tag = pad('RESULT', 10);
  if (success) {
    console.log(`${tag}: ${colored('PASS', 'cyan')}`);
  } else {
    const msg = `FAIL (${err ? '' : 'got '}${retval})`;
    console.log(`${tag}: ${colored(msg, 'red')}`);
  }

  tag = pad('TIME', 10);
  console.log(`${tag}: ${colored(`${duration.toFixed(3)}ms`, 'green')}`);
  console.log();

  return success;
}

function runTests(title) {
  const solution = getSolution(title);
  const tests = getTest(title);

  if (!solution) {
    console.log(colored(`No solution for "${title}"`, 'red'));
  } else if (!tests) {
    console.log(colored(`No test for "${title}"`, 'red'));
  } else {
    const total = tests.length;
    const passes = tests.filter(runTest.bind(null, solution)).length;

    const color = total === passes ? 'cyan' : 'red';
    console.log(colored('[TOTAL RESULT]', 'green'));
    console.log(colored(`${passes} out of ${total}`, color));
    console.log();
  }
}

function usage() {
  console.log('Usage: node judge[.js] <problem_title>');
}

function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    usage();
  } else {
    runTests(args[0]);
  }
}

if (require.main === module) {
  main();
}
