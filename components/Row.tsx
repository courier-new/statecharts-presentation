import React, { FC } from 'react';
import { map } from 'lodash';

const Row: FC<{ children: JSX.Element[]; height?: string | number }> = ({
  children,
  height,
}) => (
  <div
    style={{
      display: 'flex',
      height:height,
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    {map(children, (child) => (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          width: '30%',
        }}
      >
        {child}
      </div>
    ))}
  </div>
);

export default Row;
