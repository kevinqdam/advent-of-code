const fs = require('fs');
const input = fs.readFileSync('./input.txt')
  .toString()
  .trim();

const commands = input
  .split('\n')
  .map((commandStr) => commandStr.trim())
  .map((command) => command.split(' '))
  .map(([ direction, magnitude ]) => ({ direction, magnitude }));

const DEPTH_INDEX = 1;
const UNIT_VECTORS = {
  forward: [ 1, 0, 0 ],
  down: [ 0, 0, 1 ],
  up: [ 0, 0, -1 ],
};

const scaleVector = (vector, c) => vector.map((x_i) => x_i * c);
const commandToDisplacementVector = function (command, aim) {
  if (command.direction === 'forward') {
    const displacementVector = scaleVector(UNIT_VECTORS.forward, command.magnitude);
    displacementVector[DEPTH_INDEX] = (aim * command.magnitude);

    return displacementVector;
  }
  if (command.direction === 'down') return scaleVector(UNIT_VECTORS.down, command.magnitude);
  if (command.direction === 'up') return scaleVector(UNIT_VECTORS.up, command.magnitude);
};
const addVectors = ([ u_1, u_2, u_3 ], [ v_1, v_2, v_3 ]) => [
  u_1 + v_1,
  u_2 + v_2,
  u_3 + v_3
];
const move = ([ x, d, a ], command) => addVectors([ x, d, a ], commandToDisplacementVector(command, a));

const process = function (commands) {
  const [ finalHorizontal, finalDepth, _ ] = commands.reduce((currentPosition, command) => move(currentPosition, command), [ 0, 0, 0 ]);

  return (finalHorizontal * finalDepth);
};

console.log(process(commands)); // 1594785890
