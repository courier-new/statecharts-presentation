import React, { FC, useEffect, useState } from 'react';
import { useMachine } from '@xstate/react';

import TrafficLight, { StateColor } from './TrafficLight';
import { expandedTrafficLightMachine, ExpandedState } from '../machines/traffic-light';

const TrafficLightWithControl: FC<{ auto?: boolean }> = ({ auto }) => {
  const [state, send] = useMachine(expandedTrafficLightMachine);

  const [currentColor, setCurrentColor] = useState<StateColor>('green');

  const getColor = (state: ExpandedState): StateColor => {
    switch (true) {
      case state.matches({ connected: 'green' }):
        return 'green';
      case state.matches({ connected: 'yellow' }):
        return 'yellow';
      case state.matches({ connected: 'red' }):
        return 'red';
      case state.matches('disconnected'):
        return 'hazard';
    }
  };

  // When the state changes, set the color of the traffic light to match
  useEffect(() => {
    setCurrentColor(getColor(state));
  }, [state, setCurrentColor]);

  // If the mode is the auto-transition mode, issue a timer event every second
  useEffect(() => {
    if (auto) {
      setTimeout(() => send('TIME_UP'), 1000);
    }
  }, [auto, state]);

  // Sends a "SIGNAL_FOUND" or "SIGNAL_LOST" event depending on the current state
  const toggleSignal = () =>
    state.matches('disconnected') ? send('SIGNAL_FOUND') : send('SIGNAL_LOST');

  const buttons = auto ? null : (
    <div style={{ display: 'flex' }}>
      <button onClick={() => send('TIME_UP')}>Next</button>
      <button
        style={{ backgroundColor: 'transparent', width: 100, marginRight: -100 }}
        onClick={toggleSignal}
      />
    </div>
  );

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <TrafficLight currentColor={currentColor} />
      <div style={{ padding: '2vh' }} />
      {buttons}
    </div>
  );
};

export default TrafficLightWithControl;
