import { Machine, State } from 'xstate';

type StateSchema = {
  states: {
    green: {};
    yellow: {};
    red: {};
  };
};

type Event = { type: 'TIME_UP' };

export const trafficLightMachine = Machine<never, StateSchema, Event>({
  id: 'trafficLight',
  initial: 'green',
  states: {
    green: {
      on: { TIME_UP: 'yellow' },
    },
    yellow: {
      on: { TIME_UP: 'red' },
    },
    red: {
      on: { TIME_UP: 'green' },
    },
  },
});

export type ExpandedStateSchema = {
  states: {
    disconnected: {};
    connected: StateSchema;
  };
};

export type ExpandedEvent = Event | { type: 'SIGNAL_LOST' } | { type: 'SIGNAL_FOUND' };

export const expandedTrafficLightMachine = Machine<
  never,
  ExpandedStateSchema,
  ExpandedEvent
>({
  id: 'expandedTrafficLight',
  initial: 'connected',
  states: {
    disconnected: {
      on: {
        SIGNAL_FOUND: 'connected',
      },
    },
    connected: {
      initial: 'green',
      on: { SIGNAL_LOST: 'disconnected' },
      states: {
        green: {
          on: { TIME_UP: 'yellow' },
        },
        yellow: {
          on: { TIME_UP: 'red' },
        },
        red: {
          on: { TIME_UP: 'green' },
        },
      },
    },
  },
});

export type ExpandedState = State<never, ExpandedEvent, ExpandedStateSchema>;
