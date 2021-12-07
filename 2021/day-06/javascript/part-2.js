const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByComma = str => str.split(',');
const intFromString = str => parseInt(str, 10);
const sumValues = map => Array.from(map.values()).reduce((a, b) => a + b);

const createEmptyFishColony = () => {
  const fishColony = new Map();
  fishColony.set(0, 0);
  fishColony.set(1, 0);
  fishColony.set(2, 0);
  fishColony.set(3, 0);
  fishColony.set(4, 0);
  fishColony.set(5, 0);
  fishColony.set(6, 0);
  fishColony.set(7, 0);
  fishColony.set(8, 0);

  return fishColony;
};

const frequencyMap = arr => arr.reduce((acc, x) => {
  if (!acc.has(x)) acc.set(x, 0);
  acc.set(x, acc.get(x) + 1);

  return acc;
}, createEmptyFishColony());

const elapse = generations => fishColony => {
  if (generations <= 0) return fishColony;

  let result = fishColony;
  for (let i = 0; i < generations; i += 1) {
    result = nextGen(result);
  }

  return result;
};

const parse = input => pipe(input)
  .to(splitByComma)
  .to(map(intFromString))
  .to(frequencyMap)
  .value;

const nextGen = function (fishColony) {
  const next = createEmptyFishColony();
  next.set(7, fishColony.get(8));
  next.set(6, fishColony.get(7) + fishColony.get(0));
  next.set(5, fishColony.get(6));
  next.set(4, fishColony.get(5));
  next.set(3, fishColony.get(4));
  next.set(2, fishColony.get(3));
  next.set(1, fishColony.get(2));
  next.set(0, fishColony.get(1));
  next.set(8, fishColony.get(0));

  return next;
};

const main = (input) => pipe(input)
  .to(parse)
  .to(elapse(256))
  .to(sumValues)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 26984457539
console.log(`Result for input is: ${main(input)}`);     // Result for input is: 1572358335990
