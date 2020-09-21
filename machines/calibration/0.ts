import { Machine } from 'xstate';

/** The schema for the states of the machine */
type CalibrationStateSchema = {
  states: {
    dashboard: {};
    precheck1: {};
    precheck2: {};
    prime: {};
  };
};

/** The events that the machine expects to handle */
export type CalibrationEvent =
  | { type: 'START_CALIBRATION' }
  | { type: 'PASS_PRECHECK1' }
  | { type: 'PASS_PRECHECK2' }
  | { type: 'PASS_PRIME' }
  | { type: 'COMPLETE_CALIBRATION' };

export const calibrationMachine = Machine<
  never,
  CalibrationStateSchema,
  CalibrationEvent
>({
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
