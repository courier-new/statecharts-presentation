export const machineCode3 = `
export type CalibrationContextStatus = 'COMPLETE' | 'IN_PROGRESS' | 'TIMED_OUT';
export type CalibrationContextStep = 'PRECHECK1' | 'PRECHECK2' | 'PRIME' | 'DONE';


/** The context (extended state) of Precheck1 */
export type Precheck1Context = {
  firmwareUpToDate: 'waiting' | boolean;
  lidClosed: 'waiting' | boolean;
  batteryCharged: 'waiting' | boolean;
  cartridgeInstalled: 'waiting' | boolean;
};

export const INITIAL_PRECHECK1_CONTEXT: Precheck1Context = {
  firmwareUpToDate: 'waiting',
  lidClosed: 'waiting',
  batteryCharged: 'waiting',
  cartridgeInstalled: 'waiting',
};


/** The context (extended state) of the machine */
export type CalibrationContext = {
  needsCalibration: boolean;
  precheck1: Precheck1Context;
  status: CalibrationContextStatus;
  step: CalibrationContextStep;
};


/** Event type for updating the status checks of Precheck1 */
export type UpdatePrecheck1Event = {
  type: 'UPDATE_PRECHECK1';
  status: Partial<Precheck1Context>;
};


/** Action to update the status of a Precheck1 checks in context */
const updatePrecheck1 = assign({
  precheck1: (context: CalibrationContext, event: UpdatePrecheck1Event) => ({
    ...context.precheck1,
    ...event.status,
  }),
});


/** Action to reset the status of a Precheck1 checks in context */
const resetPrecheck1 = assign({
  precheck1: (context: CalibrationContext, event: UpdatePrecheck1Event) =>
    INITIAL_PRECHECK1_CONTEXT,
});


/** Builds a machine configuration for any of the steps that poll */
const generateStepStates = (
  pollingActivity: string,
  retryDestination: string,
  retryAction?: AssignAction<CalibrationContext, CalibrationEvent>,
) => ({
  initial: 'check' as const,
  states: {
    check: {
      activities: [pollingActivity],
      on: { ERROR: 'error' } as const,
    },
    error: {
      on: {
        RETRY: {
          target: retryDestination,
          actions: retryAction,
        },
      } as const,
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
  Machine<CalibrationContext, CalibrationStateSchema, CalibrationEvent>(
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
          on: {
            UPDATE_PRECHECK1: {
              target: 'precheck1',
              actions: 'updatePrecheck1',
            },
            PASS_PRECHECK1: 'precheck2',
          },
          ...generateStepStates('pollingPrecheck1', '#precheck1', resetPrecheck1),
        },
        precheck2: {
          id: 'precheck2',
          on: { PASS_PRECHECK2: 'prime' },
          ...generateStepStates('pollingPrecheck2', '#precheck2'),
        },
        prime: {
          on: {
            PASS_PRIME: {
              target: 'dashboard',
              actions: resetPrecheck1,
            },
          },
          ...generateStepStates('pollingPrime', '#precheck2'),
        },
      },
    },
    {
      actions: { resetPrecheck1, updatePrecheck1 },
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

export const appCode3 = `
const getDisplayText = (contextValue: 'waiting' | boolean) => {
  switch (contextValue) {
    case 'waiting':
      return '?';
    case true:
      return 'PASS';
    case false:
      return 'FAIL';
  }
};

const Precheck1: FC<Precheck1Context & { send: (event: CalibrationEvent) => void }> = ({
  firmwareUpToDate,
  lidClosed,
  batteryCharged,
  cartridgeInstalled,
  send,
}) => {
  // Run effect anytime a status updates to check if Precheck1 has passed or failed
  useEffect(() => {
    if (
      isBoolean(firmwareUpToDate) &&
      isBoolean(lidClosed) &&
      isBoolean(batteryCharged) &&
      isBoolean(cartridgeInstalled)
    ) {
      if (firmwareUpToDate && lidClosed && batteryCharged && cartridgeInstalled) {
        send({ type: 'PASS_PRECHECK1' });
      } else {
        send({ type: 'ERROR' });
      }
    }
  }, [firmwareUpToDate, lidClosed, batteryCharged, cartridgeInstalled, send]);

  return (
    <div className="precheck1">
      <div className="check">
        <span>Firmware up-to-date</span>
        <strong>{getDisplayText(firmwareUpToDate)}</strong>
      </div>
      <div className="check">
        <span>Lid closed</span>
        <strong>{getDisplayText(lidClosed)}</strong>
      </div>
      <div className="check">
        <span>Battery charged</span>
        <strong>{getDisplayText(batteryCharged)}</strong>
      </div>
      <div className="check">
        <span>Cartridge installed</span>
        <strong>{getDisplayText(cartridgeInstalled)}</strong>
      </div>
    </div>
  );
};

const getView = (
  state: CalibrationState,
  send: (event: CalibrationEvent) => void,
  failChance: number
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
        <Precheck1Updater failChance={failChance} send={send} />,
        <Precheck1 send={send} {...state.context.precheck1} />,
        ,
        getRetryButton(state, send, incrementResetKey),
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
  reset?: () => void,
) =>
  state.matches({ precheck1: 'error' }) ||
  state.matches({ precheck2: 'error' }) ||
  state.matches({ prime: 'error' }) ? (
    <button
      onClick={() => {
        reset && reset();
        send({ type: 'RETRY' });
      }}
    >
      Retry
    </button>
  ) : null;

export const App3: FC<{}> = () => {
  const machine = generateCalibrationMachine({
    needsCalibration: true,
    precheck1: INITIAL_PRECHECK1_CONTEXT,
    status: 'COMPLETE',
    step: 'DONE',
  });

  return <InnerApp machine={machine} key={machine.id} />;
};

const InnerApp: FC<{ machine: CalibrationMachine }> = ({ machine }) => {
  const [state, send] = useMachine(machine);
  const [failChance, setFailChance] = useState<string>('50');

  const formDisabled = !state.matches('dashboard');

  return (
    <>
      {getView(state, send, parsedFailChance, { resetKey, incrementResetKey })}
      <form>
        <label htmlFor="failChance">Fail Chance</label>
        <input
          disabled={formDisabled}
          name="failChance"
          type="text"
          size={3}
          value={failChance}
          onChange={(event) => {
            setFailChance(event.target.value);
          }}
        />
      </form>
    </>
  );
};
`;
