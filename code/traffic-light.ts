export const trafficLightMachineCode = `
const trafficLightMachine = Machine({
  id: 'trafficLight',
  initial: 'green',
  states: {
    green: {
      on: { TIME_UP: 'yellow' },
    },
    yellow: {
      on: { TIME_UP: 'red' },
    },
    red: {
      on: { TIME_UP: 'green' },
    },
  },
});
`;

export const expandedTrafficLightMachineCode = `
const expandedTrafficLightMachine = Machine({
  id: 'expandedTrafficLight',
  initial: 'connected',
  states: {
    disconnected: {
      on: { SIGNAL_FOUND: 'connected' },
    },
    connected: {
      initial: 'green',
      on: { SIGNAL_LOST: 'disconnected' },
      states: {
        green: {
          on: { TIME_UP: 'yellow' },
        },
        yellow: {
          on: { TIME_UP: 'red' },
        },
        red: {
          on: { TIME_UP: 'green' },
        },
      },
    },
  },
});
`;

export const trafficLightCode = `
const TrafficLightWithControl: FC<{}> = () => {
  const [state, send] = useMachine(expandedTrafficLightMachine);

  const [currentColor, setCurrentColor] = useState<StateColor>('green');

  const getColor = (state: ExpandedState): StateColor => {
    switch (true) {
      case state.matches({ connected: 'green' }):
        return 'green';
      case state.matches({ connected: 'yellow' }):
        return 'yellow';
      case state.matches({ connected: 'red' }):
        return 'red';
      case state.matches('disconnected'):
        return 'hazard';
    }
  };

  // When the state changes, set the color of the traffic light to match
  useEffect(() => {
    setCurrentColor(getColor(state));
  }, [state]);

  // Sends a "SIGNAL_FOUND" or "SIGNAL_LOST" event depending on the current state
  const toggleSignal = () =>
    state.matches('disconnected') ? send('SIGNAL_FOUND') : send('SIGNAL_LOST');

  const buttons = (
    <div style={styles.flex}>
      <button onClick={() => send('TIME_UP')}>Next</button>
      <button onClick={toggleSignal} style={styles.invisible} />
    </div>
  );

  return (
    <>
      <TrafficLight currentColor={currentColor} />
      {buttons}
    </>
  );
};
`;
