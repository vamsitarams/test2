import i18nTools from './i18nTools';

const FLIGHT_STATUS_EARLY = '1';
const FLIGHT_STATUS_ONTIME = '2';
const FLIGHT_STATUS_DELAY_1 = '3';
const FLIGHT_STATUS_DELAY_2 = '4';
const FLIGHT_STATUS_DELEY_3 = '5';
const FLIGHT_STATUS_CANCELLED = '6';
const FLIGHT_STATUS_DIVERTED = '7';

export const getFlightStatusList = () => {
  const { l } = i18nTools;
  return [
    { value: FLIGHT_STATUS_EARLY, label: l('Early') },
    { value: FLIGHT_STATUS_ONTIME, label: l('On time') },
    { value: FLIGHT_STATUS_DELAY_1, label: l('Delay \u2264 15 min') },
    { value: FLIGHT_STATUS_DELAY_2, label: l('Delay 16-45 min') },
    { value: FLIGHT_STATUS_DELEY_3, label: l('Delay > 45 min') },
    { value: FLIGHT_STATUS_CANCELLED, label: l('Canceled') },
    { value: FLIGHT_STATUS_DIVERTED, label: l('Diverted') }
  ];
};
