export const calibrationSwitch = `
switch(calibration.step) {
  case "PRECHECK1":
    return <PreCheck1 />;
  case "PRECHECK2":
    return <PreCheck2Confirmation />;
  // This screen shouldn't be visible on other steps
  default:
    return <Text>{"Calibration in progress"}</Text>;
}
`;
