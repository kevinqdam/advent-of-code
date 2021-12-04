const fs = require('fs');
const pipe = (value) => ({ value, to: (fn) => pipe(fn(value)) });

const toBitMatrix = bitRowString => (
  bitRowString
    .split('\n')
    .map(binaryString => binaryString.split('').map(bitStr => parseInt(bitStr, 2)))
);

const transpose = function (matrix) {
  const result = [];
  for (let col = 0; col < matrix[0].length; col += 1) {
    const column = [];
    for (let row = 0; row < matrix.length; row += 1) {
      column.push(matrix[row][col]);
    }
    result.push(column);
  }

  return result;
};

const mostCommonBit = function (bitArray) {
  const sum = bitArray.reduce((a, b) => a + b);

  return (sum > Math.floor(bitArray.length / 2) ? 1 : 0);
};

const rowsToMostCommonBit = (bitMatrix) => bitMatrix.map(mostCommonBit);

const leastCommonBit = function (row) {
  const sum = row.reduce((a, b) => a + b);

  return (sum > Math.floor(row.length / 2) ? 0 : 1);
};

const rowsToLeastCommonBit = (bitMatrix) => bitMatrix.map(leastCommonBit);

const joinToString = (mostCommonBitArray) => mostCommonBitArray.join('');

const numberFromBinaryString = (binaryStr) => parseInt(binaryStr, 2);

const getGammaRate = input => pipe(input)
  .to(toBitMatrix)
  .to(transpose)
  .to(rowsToMostCommonBit)
  .to(joinToString)
  .to(numberFromBinaryString)
  .value;

const getEpsilonRate = input => pipe(input)
  .to(toBitMatrix)
  .to(transpose)
  .to(rowsToLeastCommonBit)
  .to(joinToString)
  .to(numberFromBinaryString)
  .value;

const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

console.log(getGammaRate(example) * getEpsilonRate(example)); // 198
console.log(getGammaRate(input) * getEpsilonRate(input));     // 1540244
