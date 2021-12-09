const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const pipe = value => ({ value, to: fn => pipe(fn(value)) });
const map = fn => arr => arr.map(fn);
const getFromMap = map => key => map.get(key);
const getFromObj = obj => key => obj[key];
const sort = comp => arr => arr.sort(comp);
const joinByEmpty = str => str.join('');
const splitByEmpty = str => str.split('');
const splitByNewLine = str => str.split('\n');
const splitByPipe = str => str.split('|');
const splitBySpace = str => str.split(' ');
const trim = str => str.trim();
const intFromString = str => parseInt(str, 10);
const sum = nums => nums.reduce((a, b) => a + b, 0);
const DISPLAY_VALUES = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
};

const createSignalMap = (function () {
  let zero;
  let one;
  let four;
  let six;
  let seven;
  let nine;
  let signalMap;
  const lengthToSignals = new Map();

  const getKeyToA = function () {
    const set = new Set();
    for (let i = 0; i < one.length; i += 1) { set.add(one[i]); }
    for (let i = 0; i < seven.length; i += 1) {
      if (!set.has(seven[i])) return seven[i];
    }
  };
  
  const getSix = function () {
    [ sixLengthOne, sixLengthTwo, sixLengthThree ] = lengthToSignals.get(6);
    const setOne = new Set();
    for (let i = 0; i < sixLengthOne.length; i += 1) { setOne.add(sixLengthOne[i]); }
    const setTwo = new Set();
    for (let i = 0; i < sixLengthTwo.length; i += 1) { setTwo.add(sixLengthTwo[i]); }
    const setThree = new Set();
    for (let i = 0; i < sixLengthThree.length; i += 1) { setThree.add(sixLengthThree[i]); }
    for (let i = 0; i < one.length; i += 1) {
      if (!setOne.has(one[i])) {
        six = sixLengthOne;
        return;
      }
      if (!setTwo.has(one[i])) {
        six = sixLengthTwo;
        return;
      }
      if (!setThree.has(one[i])) {
        six = sixLengthThree;
        return;
      }
    }
  };

  const getKeyToD = function () {
    [ sixLengthOne, sixLengthTwo ] = lengthToSignals.get(6).filter(x => x !== six);
    const setOne = new Set();
    for (let i = 0; i < sixLengthOne.length; i += 1) { setOne.add(sixLengthOne[i]); }
    const setTwo = new Set();
    for (let i = 0; i < sixLengthTwo.length; i += 1) { setTwo.add(sixLengthTwo[i]); }
    for (let i = 0; i < four.length; i += 1) {
      if (!setOne.has(four[i])) {
        zero = sixLengthOne;
        return four[i];
      }
      if (!setTwo.has(four[i])) {
        zero = sixLengthTwo;
        return four[i];
      }
    }
  };

  const getNine = function () {
    nine = lengthToSignals.get(6).filter(x => x !== six && x !== zero)[0];
  };

  const getKeyToB = function () {
    const set = new Set();
    for (let i = 0; i < one.length; i += 1) { set.add(one[i]); }
    for (let i = 0; i < four.length; i += 1) {
      if (!set.has(four[i]) && !signalMap.has(four[i])) return four[i];
    }
  };

  const getKeyToG = function () {
    const set = new Set();
    for (let i = 0; i < four.length; i += 1) { set.add(four[i]); }
    for (let i = 0; i < seven.length; i += 1) { set.add(seven[i]); }
    for (let i = 0; i < nine.length; i += 1) {
      if (!set.has(nine[i])) return nine[i];
    }
  };

  const getKeyToC = function () {
    const set = new Set();
    for (let i = 0; i < six.length; i += 1) { set.add(six[i]); }
    for (let i = 0; i < one.length; i += 1) {
      if (!set.has(one[i])) return one[i];
    }
  };

  const getKeyToF = function () {
    for (let i = 0; i < one.length; i += 1) {
      if (!signalMap.has(one[i])) return one[i];
    }
  };

  const getKeyToE = function () {
    for (let i = 0; i < six.length; i += 1) {
      if (!signalMap.has(six[i])) return six[i];
    }
  };

  return function (signals) {
    signalMap = new Map();
    lengthToSignals.clear();
    for (const signal of signals) {
      if (!lengthToSignals.has(signal.length)) lengthToSignals.set(signal.length, []);
      lengthToSignals.get(signal.length).push(signal);
    }
    one = lengthToSignals.get(2)[0];
    four = lengthToSignals.get(4)[0];
    seven = lengthToSignals.get(3)[0];
    signalMap.set(getKeyToA(), 'a');
    getSix();
    signalMap.set(getKeyToD(), 'd');
    getNine();
    signalMap.set(getKeyToB(), 'b');
    signalMap.set(getKeyToG(), 'g');
    signalMap.set(getKeyToC(), 'c');
    signalMap.set(getKeyToF(), 'f');
    signalMap.set(getKeyToE(), 'e');

    return signalMap;
  };
}());

const getSignalMap = ([ signals, outputs ]) => [ createSignalMap(signals), outputs ];
const getValue = ([ signalMap, outputs ]) => pipe(outputs)
  .to(map(splitByEmpty))
  .to(map(map(getFromMap(signalMap))))
  .to(map(sort()))
  .to(map(joinByEmpty))
  .to(map(getFromObj(DISPLAY_VALUES)))
  .to(joinByEmpty)
  .to(intFromString)
  .value;

const processLines = lines => pipe(lines)
  .to(map(getSignalMap))
  .to(map(getValue))
  .value;

const parse = (text) => pipe(text)
  .to(splitByNewLine)
  .to(map(splitByPipe))
  .to(map(map(trim)))
  .to(map(map(splitBySpace)))
  .value;

const main = text => pipe(text)
  .to(parse)
  .to(processLines)
  .to(sum)
  .value;

console.log(`Result for example is: ${main(example)}`); // Result for example is: 61229
console.log(`Result of input is: ${main(input)}`);      // Result of input is: 982158
