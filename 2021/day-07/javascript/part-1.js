const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByComma = str => str.split(',');
const intFromString = str => parseInt(str, 10);
const sortNumbers = nums => [...nums].sort((a, b) => a - b);
const parse = text => pipe(text).to(splitByComma).to(map(intFromString)).value;
const isEven = num => ((num % 2) === 0);
const midpoint = (low, high) => (Math.floor((high - low + 1) / 2) + low);
const sum = nums => nums.reduce((a, b) => a + b, 0);

const minFuel = (function () {
  const fuelFromSourceToTarget = target => source => Math.abs(target - source);

  const minFuelEven = function (sortedPositions) {
    const [ mid1, mid2 ] = [
      sortedPositions[midpoint(0, sortedPositions.length - 1)],
      sortedPositions[midpoint(0, sortedPositions.length - 1) - 1],
    ];

    return Math.min(
      sum(sortedPositions.map(fuelFromSourceToTarget(mid1))),
      sum(sortedPositions.map(fuelFromSourceToTarget(mid2))),
    );
  };

  const minFuelOdd = function (sortedPositions) {
    const mid = sortedPositions[midpoint(0, sortedPositions.length - 1)];
    
    return sum(sortedPositions.map(fuelFromSourceToTarget(mid)));
  };

  return function (positions) {
    if (isEven(positions.length)) return minFuelEven(sortNumbers(positions));

    return minFuelOdd(sortNumbers(positions));
  };
}());

const main = text => pipe(text)
  .to(parse)
  .to(minFuel)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 37
console.log(`Result for input is: ${main(input)}`);     // Result for input is: 355764
