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
  | { type: 'RETRY' }
  | { type: 'RESUME' };

export type CalibrationContextStatus = 'COMPLETE' | 'IN_PROGRESS' | 'TIMED_OUT';
export type CalibrationContextStep = 'PRECHECK1' | 'PRECHECK2' | 'PRIME' | 'DONE';

/** The context (extended state) of the machine */
export type CalibrationContext = {
  needsCalibration: boolean;
  status: CalibrationContextStatus;
  step: CalibrationContextStep;
};

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
      id: `machine+${initialContext.status}+${initialContext.step}+${initialContext.needsCalibration}`,
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

export type CalibrationState = State<
  CalibrationContext,
  CalibrationEvent,
  CalibrationStateSchema
>;

export type CalibrationMachine = ReturnType<typeof generateCalibrationMachine>;
