export const machineCode0 = `
export const calibrationMachine = Machine({
  id: 'machine',
  initial: 'dashboard',
  states: {
    dashboard: {
      on: { START_CALIBRATION: 'precheck1' },
    },
    precheck1: {
      on: { PASS_PRECHECK1: 'precheck2' },
    },
    precheck2: {
      on: { PASS_PRECHECK2: 'prime' },
    },
    prime: {
      on: { PASS_PRIME: 'dashboard' },
    },
  },
});
`;

export const appCode0 = `
const getView = (
  state: StateValue,
  send: (event: CalibrationEvent) => void,
): JSX.Element[] => {
  switch (state) {
    case 'dashboard': {
      return [
        <h2>Dashboard</h2>,
        <button onClick={() => send({ type: 'START_CALIBRATION' })}>
          Start Calibration
        </button>,
      ];
    }
    case 'precheck1': {
      return [
        <h2>Precheck1</h2>,
        <button onClick={() => send({ type: 'PASS_PRECHECK1' })}>
          Pass Precheck1
        </button>,
      ];
    }
    case 'precheck2': {
      return [
        <h2>Precheck2</h2>,
        <button onClick={() => send({ type: 'PASS_PRECHECK2' })}>
          Pass Precheck2
        </button>,
      ];
    }
    case 'prime': {
      return [
        <h2>Prime Function</h2>,
        <button onClick={() => send({ type: 'PASS_PRIME' })}>
          Pass Prime Function
        </button>,
      ];
    }
  }
};

export const App0: FC<{}> = () => {
  const [state, send] = useMachine(calibrationMachine);

  return getView(state.value, send);
};
`;
