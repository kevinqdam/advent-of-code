const fs = require('fs');
const input = fs.readFileSync('./input.txt')
  .toString()
  .trim();
const measurements = input.split('\n').map((m) => parseInt(m, 10));

const countIncreaseFromPrevious = function (measurements) {
  let result = 0;
  for (let i = 1; i < measurements.length; i += 1) {
    const previous = measurements[i - 1];
    const current = measurements[i];
    result = (current > previous) ? (result + 1) : result;
  }

  return result;
};

console.log(countIncreaseFromPrevious(measurements)); // => 1139
