export const simpleStateMachine = `
const TRANSITION_SCHEMA = {
  green: { timer: 'yellow' },
  yellow: { timer: 'red' },
  red: { timer: 'green' },
};

class StateMachine {
  constructor(initialState, transitions) {
    this.state = initialState;
    this.transitions = transitions;
  }

  transition(event) {
    this.state = this.transitions[this.state][event];
  }
}

const machine = new StateMachine('green', TRANSITION_SCHEMA);

machine.transition('timer');
console.log(machine.state); // => 'yellow'

machine.transition('timer');
console.log(machine.state); // => 'red'

machine.transition('timer');
console.log(machine.state); // => 'green'
`;
