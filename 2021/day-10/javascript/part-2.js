const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const lines = text => text.split('\n');
const splitByEmpty = str => str.split('');
const map = fn => arr => arr.map(fn);
const getFromMap = map => key => map.get(key);
const reverse = arr => { const result = [...arr].reverse(); return result; };
const filter = pred => arr => arr.filter(pred);
const sort = comparator => arr => { const result = [...arr].sort(comparator); return result; }
const mid = arr => arr[(Math.floor(arr.length / 2))];
const complement = pred => x => !pred(x);
const peek = stack => stack[stack.length - 1];
const score = scores => xs => xs.reduce((acc, x) => { acc *= 5; acc += scores.get(x); return acc; }, 0);

const scores = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
]);

const openToClose = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
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

const removeBalanced = function (arr) {
  const stack = [];
  for (const x of arr) {
    if (!closeToOpen.has(x)) stack.push(x);
    else if (closeToOpen.get(x) === peek(stack)) stack.pop();
  }

  return stack;
};

const parse = text => pipe(text)
  .to(lines)
  .to(map(splitByEmpty))
  .to(filter(complement(isCorrupt)))
  .to(map(removeBalanced))
  .to(map(reverse))
  .to(map(map(getFromMap(openToClose))))
  .to(map(score(scores)))
  .to(sort((a, b) => a - b))
  .to(mid)
  .value;

console.log(parse(example)); // 288957
console.log(parse(input));   // 2289754624
