const fs = require('fs');
const example = fs.readFileSync('./example.txt').toString().trim();
const input = fs.readFileSync('./input.txt').toString().trim();

const MARKED = null;

const or = (...args) => args.reduce((a, b) => a || b, false);
const isMarked = x => (x === MARKED);
const complement = pred => x => !pred(x);
const all = (arr, pred) => arr.reduce((acc, x) => acc && pred(x), true);
const any = (arr, pred) => arr.reduce((acc, x) => acc || pred(x), false);
const sum = (nums) => nums.reduce((a, b) => a + b, 0);

const transpose = function (matrix) {
  const transposed = [];
  for (let col = 0; col < matrix[0].length; col += 1) {
    const column = [];
    for (let row = 0; row < matrix.length; row += 1) {
      column.push(matrix[row][col]);
    }
    transposed.push(column);
  }

  return transposed;
};

const playBingo = (function () {
  const isBingo = (function () {
    const checkHorizontal = rows => any(rows, row => all(row, isMarked));
    const checkVertical = rows => any(transpose(rows), col => all(col, isMarked));

    return (board) => or(checkHorizontal(board), checkVertical(board));
  }());

  const getNumberCoordinates = function (board) {
    const numberToCoord = new Map();
    for (let row = 0; row < board.length; row += 1) {
      for (let col = 0; col < board[0].length; col += 1) {
        const number = board[row][col];
        const coord = [ row, col ];
        numberToCoord.set(number, coord);
      }
    }

    return numberToCoord;
  };

  const markNumber = function (board, numberToCoord, number) {
    if (numberToCoord.has(number)) {
      const [ row, col ] = numberToCoord.get(number);
      board[row][col] = MARKED;
    }
  };

  const aux = function (board, numberToCoord, numberStack, turns) {
    if (isBingo(board)) return turns;
    
    markNumber(board, numberToCoord, numberStack.pop());

    return aux(board, numberToCoord, numberStack, turns + 1);
  };

  return (board, numberStack) => aux(board, getNumberCoordinates(board), [...numberStack], 0);
}());

const parse = function parseIntoNumberStackAndBoardsArray(input) {
  const [ numbersCommaDelimited, ...boardRows ] = input.split('\n');
  const numbers = numbersCommaDelimited.split(',').map(num => parseInt(num, 10));

  const boards = [];
  for (const row of boardRows) {
    if (row.length === 0) {
      boards.push([]);
    } else {
      boards[boards.length - 1].push(
        row.trim()
          .split(/\s+/)
          .map(num => parseInt(num, 10))
      );
    }
  }

  return { numbers, boards };
};

const getLastWinningBoard = function (boards, numbers) {
  const turnsRequiredToWin = boards.map(board => playBingo(board, [...numbers].reverse()));
  const maxTurns = Math.max(...turnsRequiredToWin);
  const indexOfLastWinningBoard = turnsRequiredToWin.indexOf(maxTurns);

  return { turns: maxTurns, board: boards[indexOfLastWinningBoard] };
};

const score = (function () {
  const sumUnmarkedNumbers = (markedBoard) => sum(markedBoard.map(row => sum(row.filter(complement(isMarked)))));

  return (markedBoard, winningNum) => (sumUnmarkedNumbers(markedBoard) * winningNum);
}());

const main = function (input) {
  const { numbers, boards } = parse(input);
  const { turns, board: markedBoard } = getLastWinningBoard(boards, numbers);
  const winningNumber = numbers[turns - 1];
  
  return score(markedBoard, winningNumber);
};

console.log(`Result for example: ${main(example)}`); // Result for example: 1924
console.log(`Result for input: ${main(input)}`);     // Result for input: 16168
