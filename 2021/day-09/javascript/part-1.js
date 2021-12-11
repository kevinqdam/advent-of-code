const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const splitByNewline = str => str.split('\n');
const splitByEmpty = str => str.split('');
const intFromString = str => parseInt(str, 10);
const addVector = ([ r, c ]) => ([ dr, dc ]) => ([ r + dr, c + dc ]);
const isOutOfBounds = grid => ([ r, c ]) => (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length);
const getFromGrid = grid => ([ r, c ]) => grid[r][c];
const isGreaterThan = x => y => x < y
const isNil = x => (x === null || x === undefined);
const filter = pred => arr => arr.filter(pred);
const complement = pred => x => !pred(x);
const all = bools => bools.reduce((acc, x) => acc && x, true);
const sum = nums => nums.reduce((a, b) => a + b, 0);

const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const parseToGrid = text => pipe(text)
  .to(splitByNewline)
  .to(map(splitByEmpty))
  .to(map(map(intFromString)))
  .value;

const isLowPoint = (grid, [ r, c ]) => pipe([...DIRECTIONS])
  .to(map(addVector([ r, c ])))
  .to(filter(complement(isOutOfBounds(grid))))
  .to(map(getFromGrid(grid)))
  .to(filter(complement(isNil)))
  .to(map(isGreaterThan(getFromGrid(grid)([ r, c ]))))
  .to(all)
  .value;

const identifyLowPoints = function (grid) {
  const isLowPointGrid = Array.from(
    { length: grid.length }, () => Array.from(
      { length: grid[0].length }, () => false
    )
  );
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[0].length; c += 1) {
      isLowPointGrid[r][c] = isLowPoint(grid, [ r, c ]);
    }
  }

  return [ grid, isLowPointGrid ];
};

const calculateRisks = function ([ grid, isLowPointGrid ]) {
  const risks = [];
  for (let r = 0; r < grid.length; r += 1) {
    for (let c = 0; c < grid[0].length; c += 1) {
      if (isLowPointGrid[r][c]) risks.push(grid[r][c] + 1);
    }
  }

  return risks;
};

const sumRisks = grid => pipe(grid)
  .to(identifyLowPoints)
  .to(calculateRisks)
  .to(sum)
  .value;

const main = text => pipe(text)
  .to(parseToGrid)
  .to(sumRisks)
  .value;

console.log(main(example)); // 15
console.log(main(input));   // 633
