import React, { FC } from 'react';
import MainLayout from './MainLayout';
import CodeBlock from '../components/CodeBlock';
import { App0 } from '../components/calibration/0';
import { appCode0, machineCode0 } from '../code/calibration/0';
import { App1 } from '../components/calibration/1';
import { appCode1, machineCode1 } from '../code/calibration/1';
import { App2 } from '../components/calibration/2';
import { appCode2, machineCode2 } from '../code/calibration/2';
import { App3 } from '../components/calibration/3';
import { appCode3, machineCode3 } from '../code/calibration/3';

type Screen = [FC<{}>, string, string];

const SCREENS: Record<0 | 1 | 2 | 3, Screen> = {
  0: [App0, machineCode0, appCode0],
  1: [App1, machineCode1, appCode1],
  2: [App2, machineCode2, appCode2],
  3: [App3, machineCode3, appCode3],
};

const CODEBLOCK_STYLE = {
  height: 'calc((100vh - 170px)/2)',
  width: '100%',
  overflow: 'auto',
};

const LABEL_STYLE = {
  backgroundColor: '#FADA6D',
  color: '#021627',
  fontFamily: 'monospace',
  fontSize: '14px',
  fontWeight: 800,
  lineHeight: '14px',
  padding: '8px 10px',
  width: '100%',
};

const CodeSandboxLayout: FC<{ id: keyof typeof SCREENS }> = ({ id }) => {
  const [App, machineCode, appCode] = SCREENS[id];

  return (
    <MainLayout horizontalAlignment="center">
      <div style={{ display: 'flex', flex: 1, width: '103%' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <span style={LABEL_STYLE}>MACHINE-{id}.TS</span>
          <div style={CODEBLOCK_STYLE}>
            <CodeBlock fontSize="small" height="auto">
              {machineCode}
            </CodeBlock>
          </div>
          <span style={LABEL_STYLE}>APP-{id}.TSX</span>
          <div style={CODEBLOCK_STYLE}>
            <CodeBlock fontSize="small" height="auto">
              {appCode}
            </CodeBlock>
          </div>
        </div>

        <div
          className="calibration-app"
          style={{
            border: '2px solid #eee',
            flex: 1,
            marginLeft: 25,
            padding: 25,
            position: 'relative',
          }}
        >
          <App />
          <sub style={{ position: 'absolute', bottom: 20, right: 20 }}>{id}</sub>
        </div>
      </div>
    </MainLayout>
  );
};

export default CodeSandboxLayout;
