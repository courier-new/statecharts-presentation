import React, { FC, useEffect, useState } from 'react';
import TrafficLight from './TrafficLight';

const TrafficLightWithControl: FC<{ auto?: boolean }> = ({ auto }) => {
  const [currentColor, setCurrentColor] = useState<'green' | 'yellow' | 'red' | 'hazard'>(
    'green',
  );

  useEffect(() => {
    if (auto) {
      setTimeout(progress, 900);
    }
  }, [auto, currentColor]);

  const progress = () => {
    if (currentColor === 'green') {
      setCurrentColor('yellow');
    } else if (currentColor === 'yellow') {
      setCurrentColor('red');
    } else {
      setCurrentColor('green');
    }
  };

  const toggleSignal = () =>
    currentColor === 'hazard' ? setCurrentColor('green') : setCurrentColor('hazard');

  const buttons = auto ? null : (
    <div style={{ display: 'flex' }}>
      <button onClick={progress}>Next</button>
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
