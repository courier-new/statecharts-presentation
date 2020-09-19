import React, { FC } from 'react';

const VideoBlock: FC<{ label?: string; size?: 'full-width'; source: string }> = ({
  label,
  size,
  source,
}) => (
  <div
    style={{
      alignSelf: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxHeight: '90vh',
    }}
  >
    <video controls style={{ maxHeight: '85vh', maxWidth: '90vw' }}>
      <source src={source} />
    </video>
    <span style={{ fontSize: 14, paddingTop: 10 }}>{label}</span>
  </div>
);

export default VideoBlock;
