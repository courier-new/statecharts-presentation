import { Machine, State } from 'xstate';

type StepStateSchema = {
  states: {
    check: {};
    error: {};
  };
};

/** The hierarchical schema for the states of the machine */
type CalibrationStateSchema = {
  states: {
    dashboard: {};
    precheck1: StepStateSchema;
    precheck2: StepStateSchema;
    prime: StepStateSchema;
  };
};

/** The events that the machine expects to handle */
export type CalibrationEvent =
  | { type: 'START_CALIBRATION' }
  | { type: 'PASS_PRECHECK1' }
  | { type: 'PASS_PRECHECK2' }
  | { type: 'PASS_PRIME' }
  | { type: 'COMPLETE_CALIBRATION' }
  | { type: 'ERROR' }
  | { type: 'RETRY' };

/** Builds a machine configuration for any of the steps that polls */
const generateStepStates = (pollingActivity: string, retryDestination: string) => ({
  initial: 'check' as const,
  states: {
    check: {
      activities: [pollingActivity],
      on: { ERROR: 'error' } as const,
    },
    error: {
      on: { RETRY: retryDestination } as const,
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

export const calibrationMachine = Machine<
  never,
  CalibrationStateSchema,
  CalibrationEvent
>(
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

export type CalibrationState = State<never, CalibrationEvent, CalibrationStateSchema>;
