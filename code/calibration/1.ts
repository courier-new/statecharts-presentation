export const machineCode1 = `
/** Builds a machine configuration for any of the steps that poll */
const generateStepStates = (pollingActivity: string, retryDestination: string) => ({
  initial: 'check',
  states: {
    check: {
      activities: [pollingActivity],
      on: { ERROR: 'error' },
    },
    error: {
      on: { RETRY: retryDestination },
    },
  },
});


/** Builds a polling activity for a given polling function */
const generatePollingActivity = (pollingFn: () => void) => () => {
  // Start the polling activity
  const interval = setInterval(pollingFn, 1000);

  // Return a function that stops the polling activity
  return () => {
    console.log('stopping poll');
    clearInterval(interval);
  };
};

export const calibrationMachine = Machine(
  {
    id: 'machine',
    initial: 'dashboard',
    states: {
      dashboard: {
        on: {
          START_CALIBRATION: 'precheck1',
        },
      },
      precheck1: {
        id: 'precheck1',
        on: { PASS_PRECHECK1: 'precheck2' },
        ...generateStepStates('pollingPrecheck1', '#precheck1'),
      },
      precheck2: {
        id: 'precheck2',
        on: { PASS_PRECHECK2: 'prime' },
        ...generateStepStates('pollingPrecheck2', '#precheck2'),
      },
      prime: {
        on: { PASS_PRIME: 'dashboard' },
        ...generateStepStates('pollingPrime', '#precheck2'),
      },
    },
  },
  {
    activities: {
      pollingPrecheck1: generatePollingActivity(() =>
        console.log('polling for precheck1'),
      ),
      pollingPrecheck2: generatePollingActivity(() =>
        console.log('polling for precheck2'),
      ),
      pollingPrime: generatePollingActivity(() => console.log('polling for prime')),
    },
  },
);
`;

export const appCode1 = `
const getView = (
  state: CalibrationState,
  send: (event: CalibrationEvent) => void,
): JSX.Element[] => {
  switch (true) {
    case state.matches('dashboard'): {
      return [
        <h2>Dashboard</h2>,
        <button onClick={() => send({ type: 'START_CALIBRATION' })}>
          Start Calibration
        </button>,
      ];
    }
    case state.matches('precheck1'): {
      return [
        <h2>Precheck1</h2>,
        <button onClick={() => send({ type: 'PASS_PRECHECK1' })}>
          Pass Precheck1
        </button>,
        getRetryButton(state, send),
      ];
    }
    case state.matches('precheck2'): {
      return [
        <h2>Precheck2</h2>,
        <button onClick={() => send({ type: 'PASS_PRECHECK2' })}>
          Pass Precheck2
        </button>,
        getRetryButton(state, send),
      ];
    }
    case state.matches('prime'): {
      return [
        <h2>Prime Function</h2>,
        <button onClick={() => send({ type: 'PASS_PRIME' })}>
          Pass Prime Function
        </button>,
        getRetryButton(state, send),
      ];
    }
  }
};

const getRetryButton = (
  state: CalibrationState,
  send: (event: CalibrationEvent) => void,
) =>
  state.matches({ precheck1: 'error' }) ||
  state.matches({ precheck2: 'error' }) ||
  state.matches({ prime: 'error' }) ? (
    <button onClick={() => send({ type: 'RETRY' })}>
      Retry
    </button>
  ) : null;

export const App1: FC<{}> = () => {
  const [state, send] = useMachine(calibrationMachine);

  return (
    <>
      {getView(state, send)}
      <button onClick={() => send({ type: 'ERROR' })}>
        Error
      </button>
    </>
  );
};
`;
