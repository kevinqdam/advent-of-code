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
  const dfs = function (caves, currentCaveId, visited, currentPath, pathsFromStart) {
    if (currentCaveId === END) {
      currentPath.push(currentCaveId);
      pathsFromStart.push(currentPath.join(','));
      currentPath.pop();

      return;
    }

    const currentCave = caves.get(currentCaveId);

    if (!currentCave.isBigCave) visited.add(currentCave.id);
    
    currentPath.push(currentCave.id);
    for (const neighbor of currentCave.neighbors) {
      if (!visited.has(neighbor.id)) {
        dfs(caves, neighbor.id, visited, currentPath, pathsFromStart);
      }
    }
    currentPath.pop();

    if (!currentCave.isBigCave) visited.delete(currentCave.id);
  };

  return function (caves) {
    const visited = new Set();
    const currentPath = [];
    const pathsFromStart = [];
    dfs(caves, START, visited, currentPath, pathsFromStart);

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
  .to(length)
  .value;

console.log(main(example1)); // 10
console.log(main(example2)); // 19
console.log(main(example3)); // 226
console.log(main(input));    // 4720
