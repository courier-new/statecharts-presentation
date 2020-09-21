import React, { FC, useEffect } from 'react';
import { interpret, StateMachine } from 'xstate';
import { inspect } from '@xstate/inspect';

import {
  expandedTrafficLightMachine,
  trafficLightMachine,
} from '../machines/traffic-light';

const MACHINES = {
  trafficLight: trafficLightMachine,
  expandedTrafficLight: expandedTrafficLightMachine,
} as const;

const MachineInspector: FC<{
  id?: keyof typeof MACHINES;
  machine?: StateMachine<any, any, any>;
}> = ({ id, machine }) => {
  useEffect(() => {
    const machineFromProps: StateMachine<any, any, any> = machine || MACHINES[id];
    const service = interpret(machineFromProps, {
      devTools: true,
    });

    const inspector = inspect({ iframe: false, url: 'https://statecharts.io/inspect' });

    service.start();

    return inspector.disconnect;
  }, [id]);

  return null;
};

export default MachineInspector;
