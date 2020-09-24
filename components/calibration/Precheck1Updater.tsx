import React, { FC, useEffect, useState } from 'react';
import { reject } from 'lodash';

import { UpdatePrecheck1Event } from '../../machines/calibration/3';

type Status = 'firmwareUpToDate' | 'lidClosed' | 'batteryCharged' | 'cartridgeInstalled';

type StatusesSent = Set<Status>;

export const Precheck1Updater: FC<{
  failChance: number;
  send: (event: UpdatePrecheck1Event) => void;
}> = ({ failChance, send }) => {
  const [statusesSent, setStatusesSent] = useState<StatusesSent>(new Set());

  const addStatus = (status) => {
    setStatusesSent(new Set([...statusesSent, status]));
  };

  const allStatusesSent = () => statusesSent.size === 4;

  const getRandomUnsentStatus = (): Status | null => {
    const statusesLeft: Status[] = reject(
      ['firmwareUpToDate', 'lidClosed', 'batteryCharged', 'cartridgeInstalled'],
      (status) => statusesSent.has(status),
    );

    if (statusesLeft.length) {
      const randomStatusIndex = Math.floor(Math.random() * statusesLeft.length);

      return statusesLeft[randomStatusIndex];
    }
    return null;
  };

  useEffect(() => {
    if (!allStatusesSent()) {
      const timeout = Math.round(Math.random() * 8) * 1000;
      const randomStatus = getRandomUnsentStatus();
      const randomStatusResult = Math.random() * 100 > failChance;
      setTimeout(() => {
        send({
          type: 'UPDATE_PRECHECK1',
          status: { [randomStatus]: randomStatusResult },
        });

        addStatus(randomStatus);
      }, timeout);
    }
  }, [statusesSent]);

  return null;
};
