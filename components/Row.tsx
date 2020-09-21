import React, { FC } from 'react';
import { map } from 'lodash';

const Row: FC<{
  children: JSX.Element[];
  height?: string | number;
  width?: string | number;
}> = ({ children, height, width }) => (
  <div
    style={{
      display: 'flex',
      height: height,
      justifyContent: 'space-between',
      width: width || '100%',
    }}
  >
    {map(children, (child) => (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: `${Math.floor(100 / children.length) - 1}%`,
        }}
      >
        {child}
      </div>
    ))}
  </div>
);

export default Row;
