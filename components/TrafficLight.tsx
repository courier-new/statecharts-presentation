import React, { FC, useEffect, useState } from 'react';
import { transform } from 'lodash';

const darkGray = '#1F1F1F';
const mediumGray = '#2A2A2A';
const lightGray = '#4F4F4F';
const green = '#5EF471';
const yellow = '#FDD253';
const red = '#F8484E';

export type StateColor = 'green' | 'yellow' | 'red' | 'hazard';

const TrafficLight: FC<{
  currentColor: StateColor;
  opacity?: number;
}> = ({ currentColor, opacity }) => {
  const [flashing, setFlashing] = useState<boolean>(false);

  const toggleFlashing = () => setFlashing(!flashing);

  useEffect(() => {
    if (currentColor === 'hazard') {
      setTimeout(toggleFlashing, 500);
    }
  }, [currentColor, toggleFlashing]);

  const light = (color: string) => (
    <div
      style={{
        backgroundColor: color,
        borderRadius: '100%',
        width: '8vw',
        height: '8vw',
      }}
    />
  );

  const lights = transform(
    { red: red, yellow: yellow, green: green } as const,
    (acc, color, colorName) => {
      const on =
        currentColor === colorName ||
        (currentColor === 'hazard' && colorName === 'red' && flashing);

      return acc.push(
        <div
          key={colorName}
          style={{
            alignItems: 'center',
            backgroundColor: darkGray,
            borderColor: lightGray,
            borderRadius: '100%',
            borderStyle: 'solid',
            borderWidth: 2,
            display: 'flex',
            justifyContent: 'center',
            width: '9vw',
            height: '9vw',
          }}
        >
          {on ? light(color) : null}
        </div>,
      );
    },
    [] as JSX.Element[],
  );

  return (
    <div
      style={{
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: mediumGray,
        borderColor: lightGray,
        borderRadius: 5,
        borderStyle: 'solid',
        borderWidth: 5,
        boxShadow: '0px 0px 10px 0px #565656',
        display: 'flex',
        flexDirection: 'column',
        height: '32vw',
        justifyContent: 'space-evenly',
        opacity: opacity,
        paddingBottom: '1vw',
        paddingTop: '1vw',
        width: '12vw',
      }}
    >
      {lights}
    </div>
  );
};

export default TrafficLight;
