export const machineCode2 = `
export type CalibrationContextStatus = 'COMPLETE' | 'IN_PROGRESS' | 'TIMED_OUT';
export type CalibrationContextStep = 'PRECHECK1' | 'PRECHECK2' | 'PRIME' | 'DONE';


/** The context (extended state) of the machine */
export type CalibrationContext = {
  needsCalibration: boolean;
  status: CalibrationContextStatus;
  step: CalibrationContextStep;
};


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


/** Guards */
const canCalibrate = (context: CalibrationContext): boolean =>
  context.status === 'COMPLETE' && context.needsCalibration;
const isInProgress = (context: CalibrationContext): boolean =>
  context.status === 'IN_PROGRESS';
const isOnPrecheck1 = (context: CalibrationContext): boolean =>
  isInProgress(context) && context.step === 'PRECHECK1';
const isOnPrecheck2 = (context: CalibrationContext): boolean =>
  isInProgress(context) && context.step === 'PRECHECK2';
const isOnPrime = (context: CalibrationContext): boolean =>
  isInProgress(context) && context.step === 'PRIME';

export const generateCalibrationMachine = (initialContext: CalibrationContext) =>
  Machine(
    {
      id: 'machine',
      initial: 'dashboard',
      context: initialContext,
      states: {
        dashboard: {
          on: {
            START_CALIBRATION: { target: 'precheck1', cond: 'canCalibrate' },
            RESUME: [
              // Transitions are tested one at a time
              // The first valid transition will be taken
              { target: 'precheck1', cond: 'isOnPrecheck1' },
              { target: 'precheck2', cond: 'isOnPrecheck2' },
              { target: 'prime', cond: 'isOnPrime' },
            ],
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
      guards: {
        canCalibrate,
        isInProgress,
        isOnPrecheck1,
        isOnPrecheck2,
        isOnPrime,
      },
    },
  );
`;

export const appCode2 = `
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

export const App2: FC<{}> = () => {
  const [initialContext, setInitialContext] = useState<CalibrationContext>({
    needsCalibration: false,
    status: 'COMPLETE',
    step: 'DONE',
  });

  const machine = generateCalibrationMachine(initialContext);

  return (
    <InnerApp
      machine={machine}
      key={machine.id}
      initialContext={initialContext}
      setInitialContext={setInitialContext}
    />
  );
};

const InnerApp: FC<{
  machine: CalibrationMachine;
  initialContext: CalibrationContext;
  setInitialContext: React.Dispatch<React.SetStateAction<CalibrationContext>>;
}> = ({ machine, initialContext, setInitialContext }) => {
  const [state, send] = useMachine(machine);

  const formDisabled = !state.matches('dashboard');

  return (
    <>
      <button onClick={() => send({ type: 'RESUME' })}>
        Resume
      </button>
      {getView(state, send)}
      <button onClick={() => send({ type: 'ERROR' })}>
        Error
      </button>
      <hr />
      <InitialContextForm
        disabled={formDisabled}
        initialContext={initialContext}
        setInitialContext={setInitialContext}
      />
    </>
  );
};

`;
