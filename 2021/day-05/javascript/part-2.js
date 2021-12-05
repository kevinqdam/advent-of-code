const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const splitByNewLine = str => str.split('\n');
const splitByArrow = str => str.split(' -> ');
const splitByComma = str => str.split(',');
const intFromStr = str => parseInt(str, 10);
const map = fn => arr => arr.map(fn);
const isHorizontal = ([[x0, y0], [x1, y1]]) => (x0 === x1);
const isVertical = ([[x0, y0], [x1, y1]]) => (y0 === y1);
const getMaxXCoord = lines => lines.reduce((acc, [[x0, y0], [x1, y1]]) => Math.max(acc, x0, x1), lines[0][0][0]);
const getMaxYCoord = lines => lines.reduce((acc, [[x0, y0], [x1, y1]]) => Math.max(acc, y0, y1), lines[0][0][1]);
const count = pred => arr => arr.reduce((acc, x) => (pred(x) ? (acc + 1) : acc ), 0);

const parse = function (input) {
  return pipe(input)
    .to(splitByNewLine)
    .to(map(splitByArrow))
    .to(map(map(splitByComma)))
    .to(map(map(map(intFromStr))))
    .value;
};

const createGrid = (maxXCoord, maxYCoord) => Array.from(
  { length: maxYCoord + 1 }, () => Array.from(
    { length: maxXCoord + 1 }, () => 0
  )
);

const drawOnGrid = (function () {
  const drawHorizontalLine = function (line, grid) {
    let [[x, y0], [_, y1]] = line;
    if (y0 > y1) [ y0, y1 ] = [ y1, y0 ];
    for (let y = y0; y <= y1; y += 1) {
      grid[y][x] += 1;
    }
  };

  const drawVerticalLine = function (line, grid) {
    let [[x0, y], [x1, _]] = line;
    if (x0 > x1) [ x0, x1 ] = [ x1, x0 ];
    for (let x = x0; x <= x1; x += 1) {
      grid[y][x] += 1;
    }
  };

  const drawDiagonalLine = (function () {
    const slope = ([[ x0, y0 ], [ x1 ,y1 ]]) => (x1 - x0) / (y1 - y0);

    const drawNegativeSlopeLine = function (line, grid) {
      const [[x0, y0], [x1, y1]] = line;
      let [ x, y ] = [ x0, y0 ];
      while (x <= x1) grid[y--][x++] += 1;
    };

    const drawPositiveSlopeLine = function (line, grid) {
      const [[x0, y0], [x1, y1]] = line;
      let [ x, y ] = [ x0, y0 ];
      while (x <= x1) grid[y++][x++] += 1;
    };

    return function (line, grid) {
      let [ [x0, y0], [x1, y1] ] = line;
      if (x0 > x1) [ [x0, y0], [x1, y1] ] = [ [x1, y1], [x0, y0] ];
      if (slope([ [x0, y0], [x1, y1] ]) > 0) drawPositiveSlopeLine([ [x0, y0], [x1, y1] ], grid);
      if (slope([ [x0, y0], [x1, y1] ]) < 0) drawNegativeSlopeLine([ [x0, y0], [x1, y1] ], grid);
    };
  }());

  return function (lines, grid) {
    lines.forEach(line => {
      if (isHorizontal(line)) drawHorizontalLine(line, grid);
      if (isVertical(line)) drawVerticalLine(line, grid);
      else drawDiagonalLine(line, grid);
    })

    return grid;
  };
}());

const countIntersections = grid => grid.reduce((acc, row) => (acc + count(x => x > 1)(row)), 0);

const main = function (input) {
  const lines = parse(input);
  const grid = createGrid(getMaxXCoord(lines), getMaxYCoord(lines));
  drawOnGrid(lines, grid);

  return countIntersections(grid);
};

console.log(`Result for example is: ${main(example)}`); // Result for example is: 12
console.log(`Result for input is: ${main(input)}`);     // Result for input is: 21373
