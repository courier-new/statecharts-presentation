import React, { FC } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';

const CodeBlock: FC<{
  children: string;
  fontSize?: 'small' | 'medium';
  height?: string | number;
  width?: string | number;
}> = ({ children, fontSize, height, width }) => {
  return (
    <div style={{ height: height, width: width || 'calc(100vw - 160px)' }}>
      <Highlight {...defaultProps} code={children} language="typescript" theme={nightOwl}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className}
            style={{
              ...style,
              fontSize: fontSize === 'small' ? 15 : undefined,
              height: height,
              padding: '0 1vw',
              width: '100%',
            }}
          >
            {tokens.map((line, i) => {
              // Ensure blank lines/spaces drop onto a new line
              if (line.length === 1 && line[0].content === '') {
                line[0].content = ' ';
              }
              return (
                <div key={i} {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span
                      key={key}
                      {...getTokenProps({
                        token,
                        key,
                        style: { fontSize: fontSize === 'small' ? 15 : undefined },
                      })}
                    />
                  ))}
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
