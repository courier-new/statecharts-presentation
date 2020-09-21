import React, { FC, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';

import {
  generateCalibrationMachine,
  CalibrationContext,
  CalibrationEvent,
  CalibrationMachine,
  CalibrationState,
} from '../../machines/calibration/2';

import MachineInspector from '../MachineInspector';
import { InitialContextForm } from './InitialContextForm';

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

export const App2: FC<{}> = () => {
  const [initialContext, setInitialContext] = useState<CalibrationContext>({
    needsCalibration: false,
    status: 'COMPLETE',
    step: 'DONE',
  });

  const machine = generateCalibrationMachine(initialContext);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <InnerApp
        machine={machine}
        key={machine.id}
        initialContext={initialContext}
        setInitialContext={setInitialContext}
      />
    </div>
  );
};

const InnerApp: FC<{
  machine: CalibrationMachine;
  initialContext: CalibrationContext;
  setInitialContext: React.Dispatch<React.SetStateAction<CalibrationContext>>;
}> = ({ machine, initialContext, setInitialContext }) => {
  const [state, rawSend] = useMachine(machine);

  const send = (event: any) => {
    console.log('EVENT', event);
    rawSend(event);
  };

  useEffect(() => console.log('STATE', state.value, state.context), [state]);

  const formDisabled = !state.matches('dashboard');

  return (
    <>
      <MachineInspector machine={machine} />
      <button key="resume" onClick={() => send({ type: 'RESUME' })}>
        Resume
      </button>
      {getView(state, send)}
      <button key="error" onClick={() => send({ type: 'ERROR' })}>
        Error
      </button>
      <p />
      <hr />
      <InitialContextForm
        disabled={formDisabled}
        initialContext={initialContext}
        setInitialContext={setInitialContext}
      />
    </>
  );
};
