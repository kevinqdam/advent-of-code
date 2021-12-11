const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const sort = comparator => arr => arr.sort(comparator);
const firstThree = ([ first, second, third ]) => [ first, second, third ];
const descending = (a, b) => b - a;
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
const product = nums => nums.reduce((a, b) => a * b, 1);

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

const basinSize = (function () {
  const isPartOfBasin = (grid, [ r, c ], [ dr, dc ]) => (grid[r + dr][c + dc] !== 9);

  const dfs = function (grid, [ r, c ], visited) {
    visited[r][c] = true;

    let size = 1;
    [...DIRECTIONS].forEach(([ dr, dc ]) => {
      if (!isOutOfBounds(grid)([ r + dr, c + dc ])
          && !visited[r + dr][c + dc]
          && isPartOfBasin(grid, [ r, c ], [ dr, dc ])) {
        size += dfs(grid, [ r + dr, c + dc ], visited);
      }
    });

    return size;
  };

  return grid => ([ r, c ]) => {
    const visited = Array.from({ length: grid.length }, () => Array.from({ length: grid[0].length }, () => false));

    return dfs(grid, [ r, c ], visited);
  };
}());

const coordsOfLowPoints = function (grid) {
  const lowPointCoordinates = [];
  const [ _, isLowPointGrid ] = identifyLowPoints(grid);
  for (let r = 0; r < isLowPointGrid.length; r += 1) {
    for (let c = 0; c < isLowPointGrid[0].length; c += 1) {
      if (isLowPointGrid[r][c]) lowPointCoordinates.push([ r, c ]);
    }
  }

  return lowPointCoordinates;
};

const basins = (grid) => pipe(grid)
  .to(coordsOfLowPoints)
  .to(map(basinSize(grid)))
  .to(sort(descending))
  .to(firstThree)
  .to(product)
  .value;

const main = text => pipe(text)
  .to(parseToGrid)
  .to(basins)
  .value;

console.log(main(example)); // 1134
console.log(main(input));   // 1050192
