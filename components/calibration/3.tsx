import React, { FC, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';
import { isBoolean, isNumber } from 'lodash';

import {
  generateCalibrationMachine,
  CalibrationContext,
  CalibrationEvent,
  CalibrationMachine,
  CalibrationState,
  INITIAL_PRECHECK1_CONTEXT,
  Precheck1Context,
} from '../../machines/calibration/3';

import MachineInspector from '../MachineInspector';
import { InitialContextForm } from './InitialContextForm';
import { Precheck1Updater } from './Precheck1Updater';

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
    <div className="precheck1" style={{ display: 'flex', marginBottom: 25 }}>
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
  failChance: number,
  { resetKey, incrementResetKey }: { resetKey: number; incrementResetKey: () => void },
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
        <Precheck1Updater
          key={`precheck1updater${resetKey}`}
          failChance={failChance}
          send={send}
        />,
        <Precheck1 key="precheck1" send={send} {...state.context.precheck1} />,
        ,
        getRetryButton(state, send, incrementResetKey),
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
  reset?: () => void,
) =>
  state.matches({ precheck1: 'error' }) ||
  state.matches({ precheck2: 'error' }) ||
  state.matches({ prime: 'error' }) ? (
    <button
      key="retry"
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

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <InnerApp machine={machine} key={machine.id} />
    </div>
  );
};

const InnerApp: FC<{ machine: CalibrationMachine }> = ({ machine }) => {
  const [state, rawSend] = useMachine(machine);
  const [failChance, setFailChance] = useState<string>('50');
  const [resetKey, setResetKey] = useState<number>(0);

  const incrementResetKey = () => setResetKey(resetKey + 1);

  const send = (event: any) => {
    console.log('EVENT', event);
    rawSend(event);
  };

  useEffect(() => console.log('STATE', state.value, state.context), [state]);

  const formDisabled = !state.matches('dashboard');

  const parsedFailChance = isNumber(parseInt(failChance)) ? parseInt(failChance) : 50;

  return (
    <>
      <MachineInspector machine={machine} />
      {getView(state, send, parsedFailChance, { resetKey, incrementResetKey })}
      <div className="context-form" style={{ marginTop: 50 }}>
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
      </div>
    </>
  );
};
