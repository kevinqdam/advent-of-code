const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const NEWBORN_LANTERNFISH = 8;
const NEW_LANTERNFISH = 6;

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByComma = str => str.split(',');
const intFromString = str => parseInt(str, 10);
const decrement = x => (x - 1);
const count = (pred, arr) => arr.reduce((acc, x) => pred(x) ? acc + 1 : acc, 0);
const isNegative = x => (x < 0)
const length = x => x.length;

const addNewborns = (fishColony, countToAdd) => {
  for (let i = 0; i < countToAdd; i += 1) {
    fishColony.push(NEWBORN_LANTERNFISH);
  }
};
const elapse = generations => fishColony => {
  if (generations <= 0) return fishColony;

  let result = [...fishColony];
  for (let i = 0; i < generations; i += 1) {
    result = nextGen(result);
  }

  return result;
};

const parse = input => pipe(input).to(splitByComma).to(map(intFromString)).value;

const nextGen = function (fishColony) {
  let next = fishColony.map(decrement);
  const newbornCount = count(isNegative, next);
  next = next.map(fish => isNegative(fish) ? NEW_LANTERNFISH : fish);
  addNewborns(next, newbornCount);

  return next;
};

const main = (input) => pipe(input)
  .to(parse)
  .to(elapse(80))
  .to(length)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 5934
console.log(`Result for input is: ${main(input)}`);     // Result for input is: 346063
