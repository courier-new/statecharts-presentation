import React, { FC } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import nightOwl from 'prism-react-renderer/themes/nightOwl';

const CodeBlock: FC<{
  children: string;
  fontSize?: 'small' | 'medium' | 'large';
  height?: string | number;
  width?: string | number;
}> = ({ children, fontSize, height, width }) => {
  const getFontSize = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small':
        return 15;
      case 'medium':
        return 20;
      case 'large':
        return 26;
      default:
        return 26;
    }
  };

  return (
    <div style={{ height: height, width: width || 'calc(100vw - 160px)' }}>
      <Highlight {...defaultProps} code={children} language="typescript" theme={nightOwl}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          const lineNoWidth = tokens.length >= 100 ? '2.2em' : '1.5em';

          return (
            <pre
              className={className}
              style={{
                ...style,
                fontSize: getFontSize(fontSize),
                height: height,
                padding: '1em 0.5em 0.5em 0.5em',
                width: '100%',
              }}
            >
              {tokens.map((line, i) => {
                // Drop first line
                if (i === 0) {
                  return null;
                }

                // Ensure blank lines/spaces drop onto a new line
                if (line.length === 1 && line[0].content === '') {
                  line[0].content = ' ';
                }
                return (
                  <div key={i} {...getLineProps({ line, key: i })}>
                    <span
                      style={{
                        display: 'inline-block',
                        opacity: 0.3,
                        paddingRight: '0.5em',
                        textAlign: 'right',
                        userSelect: 'none',
                        width: lineNoWidth,
                      }}
                    >
                      {i}
                    </span>
                    {line.map((token, key) => (
                      <span
                        key={key}
                        {...getTokenProps({
                          token,
                          key,
                          style: { fontSize: getFontSize(fontSize) },
                        })}
                      />
                    ))}
                  </div>
                );
              })}
            </pre>
          );
        }}
      </Highlight>
    </div>
  );
};

export default CodeBlock;
