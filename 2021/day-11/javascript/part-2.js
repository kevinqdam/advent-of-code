const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const trace = input => { console.log(input); return input; }

const DIRECTIONS = [
  [1, 0],
  [1, 1],
  [1, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1],
  [0, 1],
  [0, -1],
];
const NOT_FLASHED = 0;
const FLASH = 1;
const ALREADY_FLASHED = 2;


const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const lines = text => text.split('\n');
const splitByEmpty = str => str.split('');
const intFromStr = str => parseInt(str, 10);
const increment = x => (x + 1);
const isOutOfBounds = (grid, row, col) => (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length);
const identity = x => x;
const copyGrid = grid => pipe(grid).to(map(map(identity))).value;
const isTrue = x => (x === true);
const sum = nums => nums.reduce((a, b) => (a + b), 0);
const any = pred => arr => arr.reduce((acc, x) => (acc || pred(x)), false);
const any2D = pred => grid => pipe(grid).to(map(any(pred))).to(any(isTrue)).value;
const count = pred => arr => arr.reduce((acc, x) => (pred(x) ? (acc + 1) : acc), 0);
const count2D = pred => grid => pipe(grid).to(map(count(pred))).to(sum).value;
const drain = octopus => (octopus >= 10) ? 0 : octopus;
const getFromObj = key => obj => obj[key];

const flash = function (grid) {
  const toIncrement = [];
  const flashStatus = Array.from(
    { length: grid.length }, () => Array.from(
      { length: grid[0].length }, () => NOT_FLASHED
    )
  );
  const copy = copyGrid(grid);
  let shouldFlash = true;
  while (shouldFlash) {
    for (let r = 0; r < copy.length; r += 1) {
      for (let c = 0; c < copy[0].length; c += 1) {
        if (copy[r][c] > 9 && flashStatus[r][c] !== ALREADY_FLASHED) {
          flashStatus[r][c] = ALREADY_FLASHED;
          DIRECTIONS.forEach(([ dr, dc ]) => {
            if (!isOutOfBounds(copy, r + dr, c + dc) && flashStatus[r + dr][c + dc] !== ALREADY_FLASHED) {
              toIncrement.push([ r + dr, c + dc ]);
            }
          });
        }
      }
    }

    while (toIncrement.length > 0) {
      const [ r, c ] = toIncrement.pop();
      copy[r][c] += 1;
      if (copy[r][c] > 9 && flashStatus[r][c] !== ALREADY_FLASHED) flashStatus[r][c] = FLASH;
    }

    shouldFlash = pipe(flashStatus)
      .to(any2D(x => (x === FLASH)))
      .value;
  }

  return copy
};

const parse = text => pipe(text)
  .to(lines)
  .to(map(splitByEmpty))
  .to(map(map(intFromStr)))
  .value;

const step = grid => pipe(grid)
  .to(map(map(increment)))
  .to(flash)
  .to(map(map(drain)))
  .value;

const stepNTimes = n => grid => {
  let stepped = grid;
  let first;
  for (let i = 0; i < n; i += 1) {
    stepped = step(stepped);
    const flashed = pipe(stepped).to(count2D(octopus => (octopus === 0))).value;

    if (flashed === (grid.length * grid[0].length)) {
      first = (i + 1);

      break;
    }
  }

  return { stepped, first };
};

const main = text => pipe(text)
  .to(parse)
  .to(stepNTimes(Number.MAX_SAFE_INTEGER))
  .to(getFromObj('first'))
  .value;

console.log(main(example)); // 195
console.log(main(input));   // 285
