const fs = require('fs');
const example1 = fs.readFileSync('./example-1.txt').toString().trim();
const example2 = fs.readFileSync('./example-2.txt').toString().trim();
const example3 = fs.readFileSync('./example-3.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const START  = 'start';
const END = 'end';

const trace = input => { console.log(input); return input; }

const pipe = value => ({ value, to: fn => pipe(fn(value)) });

const lines = text => text.split('\n');
const map = fn => arr => arr.map(fn);
const splitByHyphen = str => str.split('-');
const flat = arr => arr.flat()
const reduceLeft = (fn, init) => arr => arr.reduce(fn, init);
const length = arr => arr.length;
const nub = arr => Array.from(new Set(arr));

const createCave = function (id) {
  const neighbors = [];
  const isBigCave = (id.toUpperCase() === id);

  return { id, isBigCave, neighbors };
};

const loadCaveMap = function (edges) {
  const caves = pipe(edges)
    .to(flat)
    .to(reduceLeft((acc, cave) => acc.set(cave.id, cave), new Map()))
    .value;

  return { edges, caves }
};

const connectCaves = function ({ edges, caves }) {
  for (const [ thisCave, thatCave ] of edges) {
    caves.get(thisCave.id).neighbors.push(thatCave);
    caves.get(thatCave.id).neighbors.push(thisCave);
  }

  return caves;
};

const findPathsFromStart = (function () {
  const dfs = function (
    caves,
    currentCaveId,
    visited,
    currentPath,
    pathsFromStart,
    specialSmallCaveId,
    timesVisitedSpecialSmallCave,
  ) {
    if (currentCaveId === END) {
      currentPath.push(currentCaveId);
      pathsFromStart.push(currentPath.join(','));
      currentPath.pop();

      return;
    }

    const currentCave = caves.get(currentCaveId);

    if (currentCave.id === specialSmallCaveId) {
      timesVisitedSpecialSmallCave += 1;
    } else if (!currentCave.isBigCave) {
      visited.add(currentCave.id);
    }
    
    currentPath.push(currentCave.id);
    for (const neighbor of currentCave.neighbors) {
      if (neighbor.id === specialSmallCaveId && timesVisitedSpecialSmallCave < 2) {
        dfs(caves, neighbor.id, visited, currentPath, pathsFromStart, specialSmallCaveId, timesVisitedSpecialSmallCave);
      } else if (neighbor.id !== specialSmallCaveId && !visited.has(neighbor.id)) {
        dfs(caves, neighbor.id, visited, currentPath, pathsFromStart, specialSmallCaveId, timesVisitedSpecialSmallCave);
      }
    }
    currentPath.pop();

    if (currentCave.id === specialSmallCaveId) {
      timesVisitedSpecialSmallCave -= 1;
    } else if (!currentCave.isBigCave) {
      visited.delete(currentCave.id);
    }
  };

  return function (caves) {
    const pathsFromStart = [];
    const smallCaveIds = Array.from(caves.values())
      .filter(cave => (!cave.isBigCave && cave.id !== START && cave.id !== END))
      .map(cave => cave.id);

    for (const smallCaveId of smallCaveIds) {
      const visited = new Set();
      const currentPath = [];
      dfs(caves, START, visited, currentPath, pathsFromStart, smallCaveId, 0);
    }

    return pathsFromStart;
  };
}());

const graphify = edges => pipe(edges)
  .to(loadCaveMap)
  .to(connectCaves)
  .value;

const parseToGraph = text => pipe(text)
  .to(lines)
  .to(map(splitByHyphen))
  .to(map(map(createCave)))
  .to(graphify)
  .value;

const main = text => pipe(text)
  .to(parseToGraph)
  .to(findPathsFromStart)
  .to(nub)
  .to(length)
  .value;

console.log(main(example1)); // 36
console.log(main(example2)); // 103
console.log(main(example3)); // 3509
console.log(main(input));    // 147848
