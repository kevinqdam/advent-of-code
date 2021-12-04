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

  return (sum >= Math.ceil(bitArray.length / 2) ? 1 : 0);
};

const rowsToMostCommonBit = (bitMatrix) => bitMatrix.map(mostCommonBit);

const leastCommonBit = function (row) {
  const sum = row.reduce((a, b) => a + b);

  return (sum >= Math.ceil(row.length / 2) ? 0 : 1);
};

const rowsToLeastCommonBit = (bitMatrix) => bitMatrix.map(leastCommonBit);

const joinToString = (mostCommonBitArray) => mostCommonBitArray.join('');

const numberFromBinaryString = (binaryStr) => parseInt(binaryStr, 2);

const getOxygenGeneratorRating = (function () {
  const aux = function (bitMatrix, position) {
    if (bitMatrix.length === 1) return pipe(bitMatrix[0]).to(joinToString).to(numberFromBinaryString).value;

    const bit = pipe(bitMatrix)
      .to(transpose)
      .to(rowsToMostCommonBit)
      .value[position];
    
    const nextBitMatrix = bitMatrix.filter(row => (row[position] === bit));
    
    return aux(nextBitMatrix, position + 1);
  };

  return (bitMatrix) => aux(bitMatrix, 0);
}());

const getCarbonDioxideScrubberRating = (function () {
  const aux = function (bitMatrix, position) {
    if (bitMatrix.length === 1) return pipe(bitMatrix[0]).to(joinToString).to(numberFromBinaryString).value;

    const bit = pipe(bitMatrix)
      .to(transpose)
      .to(rowsToLeastCommonBit)
      .value[position];
    
    const nextBitMatrix = bitMatrix.filter((row) => (row[position] === bit));
    
    return aux(nextBitMatrix, position + 1);
  };

  return (bitMatrix) => aux(bitMatrix, 0);
}());

const example = toBitMatrix(fs.readFileSync('./example.txt').toString().trim());
const input = toBitMatrix(fs.readFileSync('./input.txt').toString().trim());

console.log(getOxygenGeneratorRating(example) * getCarbonDioxideScrubberRating(example)); // 230
console.log(getOxygenGeneratorRating(input) * getCarbonDioxideScrubberRating(input));     // 4203981
