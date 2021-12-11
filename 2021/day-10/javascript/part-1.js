const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const lines = text => text.split('\n');
const splitByEmpty = str => str.split('');
const map = fn => arr => arr.map(fn);
const filter = pred => arr => arr.filter(pred);
const frequency = arr => arr.reduce((acc, x) => {
  if (!acc.has(x)) acc.set(x, 0);
  acc.set(x, acc.get(x) + 1);

  return acc;
}, new Map());
const entriesFromMap = map => Array.from(map.entries());
const peek = stack => stack[stack.length - 1];
const sum = nums => nums.reduce((a, b) => a + b, 0);
const score = scores => ([ x, freq ]) => (scores.get(x) * freq);

const scores = new Map([
  ['(', 3],
  ['[', 57],
  ['{', 1197],
  ['<', 25137],
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137],
]);

const closeToOpen = new Map([
  [')', '('],
  [']', '['],
  ['}', '{'],
  ['>', '<'],
]);

const isCorrupt = function (arr) {
  const stack = [];
  for (const x of arr) {
    if (!closeToOpen.has(x)) stack.push(x);
    else if (closeToOpen.get(x) === peek(stack)) stack.pop();
    else return true;
  }

  return false;
};

const firstIllegal = function (arr) {
  const stack = [];
  for (const x of arr) {
    if (!closeToOpen.has(x)) stack.push(x);
    else if (closeToOpen.get(x) === peek(stack)) stack.pop();
    else return x;
  }
};

const parse = text => pipe(text)
  .to(lines)
  .to(map(splitByEmpty))
  .to(filter(isCorrupt))
  .to(map(firstIllegal))
  .to(frequency)
  .to(entriesFromMap)
  .to(map(score(scores)))
  .to(sum)
  .value;

console.log(parse(example)); // 26397
console.log(parse(input));   // 339411
