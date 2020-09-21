import React, { FC, useEffect } from 'react';
import { useMachine } from '@xstate/react';

import {
  calibrationMachine,
  CalibrationEvent,
  CalibrationState,
} from '../../machines/calibration/1';
import MachineInspector from '../MachineInspector';

const getView = (
  state: CalibrationState,
  send: (event: CalibrationEvent) => void,
): JSX.Element[] => {
  switch (true) {
    case state.matches('dashboard'): {
      return [
        <h2 key="title">Dashboard</h2>,
        <button key="button" onClick={() => send({ type: 'START_CALIBRATION' })}>
          Start Calibration
        </button>,
      ];
    }
    case state.matches('precheck1'): {
      return [
        <h2 key="title">Precheck1</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRECHECK1' })}>
          Pass Precheck1
        </button>,
        getRetryButton(state, send),
      ];
    }
    case state.matches('precheck2'): {
      return [
        <h2 key="title">Precheck2</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRECHECK2' })}>
          Pass Precheck2
        </button>,
        getRetryButton(state, send),
      ];
    }
    case state.matches('prime'): {
      return [
        <h2 key="title">Prime Function</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRIME' })}>
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
    <button key="retry" onClick={() => send({ type: 'RETRY' })}>
      Retry
    </button>
  ) : null;

export const App1: FC<{}> = () => {
  const [state, rawSend] = useMachine(calibrationMachine);

  const send = (event: any) => {
    console.log('EVENT', event);
    rawSend(event);
  };

  useEffect(() => console.log('STATE', state.value), [state]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MachineInspector machine={calibrationMachine} />
      {getView(state, send)}
      <button key="error" onClick={() => send({ type: 'ERROR' })}>
        Error
      </button>
    </div>
  );
};
