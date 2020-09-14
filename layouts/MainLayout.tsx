import React from 'react';

export default ({ children }) => (
  <div
    style={{
      background:
        'linear-gradient(156deg, rgba(23,23,159,1) 3%, rgba(76,219,200,1) 25%, rgba(237,255,204,1) 50%, rgba(254,206,73,1) 75%, rgba(239,40,164,1) 97%)',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      padding: '20px',
      position: 'absolute',
      top: 0,
      left: 0,
    }}
  >
    <div
      style={{
        justifyContent: 'space-around',
        background: 'white',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        padding: '50px',
      }}
    >
      <div>{children}</div>
    </div>
  </div>
);
