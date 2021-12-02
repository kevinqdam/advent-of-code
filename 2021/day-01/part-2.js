const fs = require('fs');
const input = fs.readFileSync('./input.txt')
  .toString()
  .trim();
const measurements = input.split('\n').map((m) => parseInt(m, 10));

const sum = (...args) => args.reduce((acc, x) => acc + x);

const countRollingTripletSumIncreaseFromPrevious = function (measurements) {
  let result = 0;
  for (let i = 4; i < measurements.length; i += 1) {
    const previous = sum(measurements[i - 3], measurements[i - 2], measurements[i - 1]);
    const current = sum(measurements[i - 2], measurements[i - 1], measurements[i]);
    result = (current > previous) ? (result + 1) : result;
  }

  return result;
};

console.log(countRollingTripletSumIncreaseFromPrevious(measurements)); // => 1103
