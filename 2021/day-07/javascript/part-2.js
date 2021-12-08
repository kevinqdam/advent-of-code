const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByComma = str => str.split(',');
const intFromString = str => parseInt(str, 10);
const parse = text => pipe(text).to(splitByComma).to(map(intFromString)).value;
const isEven = num => ((num % 2) === 0);
const sum = nums => nums.reduce((a, b) => a + b, 0);
const min = nums => nums.reduce((a, b) => Math.min(a, b));
const max = nums => nums.reduce((a, b) => Math.max(a, b));
const nums = function (low, high) {
  const result = [];
  for (let num = low; num <= high; num += 1) {
    result.push(num);
  }

  return result;
};

const naturalSumFrom1ThroughN = function (n) {
  if (n === 0) return 0;
  if (isEven(n)) return (n / 2) * (n + 1);

  return (Math.floor(n / 2) * (n + 1)) + ((n + 1) / 2);
};

const fuelFromSourceToTarget = target => source => naturalSumFrom1ThroughN(Math.abs(target - source));
const minFuel = function (positions) {
  const possiblePositions = nums(min(positions), max(positions));
  return min(possiblePositions.map(p => sum(positions.map(fuelFromSourceToTarget(p)))));
};

const main = text => pipe(text)
  .to(parse)
  .to(minFuel)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 168
console.log(`Result for input is: ${main(input)}`);     // Result for input is: 99634572
