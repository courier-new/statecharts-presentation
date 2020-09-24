import React, { FC } from 'react';
import {
  CalibrationContext,
  CalibrationContextStatus,
  CalibrationContextStep,
} from '../../machines/calibration/2';

export const InitialContextForm: FC<{
  disabled: boolean;
  initialContext: CalibrationContext;
  setInitialContext: React.Dispatch<React.SetStateAction<CalibrationContext>>;
}> = ({ disabled, initialContext, setInitialContext }) => {
  return (
    <div className="context-form">
      <h4>Initial Context from the "Server"</h4>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <label htmlFor="status">Status</label>
        <select
          disabled={disabled}
          name="status"
          onChange={(event) =>
            setInitialContext({
              ...initialContext,
              status: event.target.value as CalibrationContextStatus,
            })
          }
        >
          <option value="COMPLETE">complete</option>
          <option value="IN_PROGRESS">in progress</option>
          <option value="ERROR">error</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <label htmlFor="status">Step</label>
        <select
          disabled={disabled}
          name="step"
          onChange={(event) =>
            setInitialContext({
              ...initialContext,
              step: event.target.value as CalibrationContextStep,
            })
          }
        >
          <option value="DONE">done</option>
          <option value="PRECHECK1">precheck 1</option>
          <option value="PRECHECK2">precheck 2</option>
          <option value="PRIME">prime</option>
        </select>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <label htmlFor="needsCalibration">Needs Calibration?</label>
        <input
          disabled={disabled}
          name="needsCalibration"
          type="checkbox"
          checked={initialContext.needsCalibration}
          onChange={(event) =>
            setInitialContext({
              ...initialContext,
              needsCalibration: event.target.checked,
            })
          }
        />
      </div>
      <pre style={{ marginTop: 20 }}>{JSON.stringify(initialContext, null, 2)}</pre>
    </div>
  );
};
