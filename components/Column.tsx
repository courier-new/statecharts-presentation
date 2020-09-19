import React, { FC } from 'react';
import { map } from 'lodash';

const Column: FC<{ children: JSX.Element[] }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '50vw',
    }}
  >
    {children}
  </div>
);

export default Column;
