const userSettings = {
  disruptionStatus: ['red', 'yellow', 'green'],
  onlyVIP: false,
  onlyAssisting: false,
  flightStatus: [
    'early',
    'ontime',
    'delayGreen',
    'delayYellow',
    'delayRed',
    'cancelled'
  ],
  flightsWithin: 30,
  airportStatus: ['black', 'red', 'yellow', 'green'],
  airportsWithin: 30,
  assistedTravelers: true,
  newTravelers: true,
  newTravelersAll: true,
  newTravelersVIP: false,
  airportStatusChange: true,
  airportStatusChangeAll: true,
  airportStatusChangeWorse: false,
  flightStatusChange: [
    'all',
    'early',
    'ontime',
    'delayGreen',
    'delayYellow',
    'delayRed',
    'cancelled'
  ]
};

export default userSettings;
