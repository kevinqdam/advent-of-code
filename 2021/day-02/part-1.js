const fs = require('fs');
const input = fs.readFileSync('./input.txt')
  .toString()
  .trim();

const commands = input
  .split('\n')
  .map((commandStr) => commandStr.trim())
  .map((command) => command.split(' '))
  .map(([ direction, magnitude ]) => ({ direction, magnitude }));

const UNIT_VECTORS = {
  forward: [ 1, 0 ],
  down: [ 0, 1 ],
  up: [ 0, -1 ],
};

const scaleVector = (vector, c) => vector.map((x_i) => x_i * c);
const commandToDisplacementVector = function (command) {
  if (command.direction === 'forward') return scaleVector(UNIT_VECTORS.forward, command.magnitude);
  if (command.direction === 'down') return scaleVector(UNIT_VECTORS.down, command.magnitude);
  if (command.direction === 'up') return scaleVector(UNIT_VECTORS.up, command.magnitude);
};
const addVectors = ([ u_1, u_2 ], [ v_1, v_2 ]) => [
  u_1 + v_1,
  u_2 + v_2
];
const move = ([ x0, d0 ], command) => addVectors([ x0, d0 ], commandToDisplacementVector(command));

const process = function (commands) {
  const [ finalHorizontal, finalDepth ] = commands.reduce((currentPosition, command) => move(currentPosition, command), [ 0, 0 ]);

  return (finalHorizontal * finalDepth);
};

console.log(process(commands)); // 1698735
