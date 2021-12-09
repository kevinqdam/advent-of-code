const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByNewLine = str => str.split('\n');
const splitByPipe = str => str.split('|');
const splitBySpace = str => str.split(' ');
const trim = str => str.trim();
const get = key => obj => obj[key];
const count = pred => arr => arr.reduce((acc, x) => pred(x) ? acc + 1: acc, 0);
const isOneFourSevenOrEight = str => str.length === 2 || str.length === 3 || str.length === 4 || str.length === 7;
const sum = nums => nums.reduce((a, b) => a + b, 0);

const parse = (text) => pipe(text)
  .to(splitByNewLine)
  .to(map(splitByPipe))
  .to(map(map(trim)))
  .to(map(map(splitBySpace)))
  .value;

const countOneFourSevenOrEight = signals => pipe(signals)
  .to(map(get(1)))
  .to(map(count(isOneFourSevenOrEight)))
  .to(sum)
  .value;

const main = text => pipe(text)
  .to(parse)
  .to(countOneFourSevenOrEight)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 26
console.log(`Result of input is: ${main(input)}`);      // Result of input is: 255
