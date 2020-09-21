import React, { FC, useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { StateValue } from 'xstate';

import { calibrationMachine, CalibrationEvent } from '../../machines/calibration/0';
import MachineInspector from '../MachineInspector';

const getView = (
  state: StateValue,
  send: (event: CalibrationEvent) => void,
): JSX.Element[] => {
  switch (state) {
    case 'dashboard': {
      return [
        <h2 key="title">Dashboard</h2>,
        <button key="button" onClick={() => send({ type: 'START_CALIBRATION' })}>
          Start Calibration
        </button>,
      ];
    }
    case 'precheck1': {
      return [
        <h2 key="title">Precheck1</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRECHECK1' })}>
          Pass Precheck1
        </button>,
      ];
    }
    case 'precheck2': {
      return [
        <h2 key="title">Precheck2</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRECHECK2' })}>
          Pass Precheck2
        </button>,
      ];
    }
    case 'prime': {
      return [
        <h2 key="title">Prime Function</h2>,
        <button key="button" onClick={() => send({ type: 'PASS_PRIME' })}>
          Pass Prime Function
        </button>,
      ];
    }
  }
};

export const App0: FC<{}> = () => {
  const [state, rawSend] = useMachine(calibrationMachine);

  const send = (event: any) => {
    console.log('EVENT', event);
    rawSend(event);
  };

  useEffect(() => console.log('STATE', state.value), [state]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MachineInspector machine={calibrationMachine} />
      {getView(state.value, send)}
    </div>
  );
};
