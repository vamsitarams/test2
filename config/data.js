const FLIGHT_DATA = {
  meta: {
    _total_size: 8,
    _size: 8,
    _total_pages: 1,
    _returned: 8
  },
  data: [
    {
      _id: {
        $oid: '6058ac7fec62986255597149'
      },
      subscriberId: {
        $oid: '5f1b2952a95be8b3033e9411'
      },
      journeyId: {
        $oid: '6022cd57e9942e4392c5e2cb'
      },
      travelerFullName: 'Michael S Cohen',
      organization: {
        type: 'primary',
        name: 'Duane Morris ',
        _id: {
          $oid: '5f19cf23a95be8b3033696f8'
        }
      },
      flightNumber: '1870',
      carrierName: 'American Airlines',
      departureLocation: {
        _id: {
          $oid: '56cc72d8e4b05395d65d4d6e'
        },
        code: 'PHL',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -75.23332977,
            39.88333511
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616960520000
        },
        estimatedDateTimeDiff: 32,
        terminal: 'B',
        gate: 'B10',
        scheduledDateTime: {
          $date: 1616958600000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc7073e4b05395d65d32ec'
        },
        code: 'FLL',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -80.15000153,
            26.06666756
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616969880000
        },
        estimatedDateTimeDiff: 6,
        terminal: '3',
        gate: 'E5',
        baggage: 'C3',
        scheduledDateTime: {
          $date: 1616969520000
        }
      },
      status: 'On Time/Delayed',
      productStatus: 'Active',
      delay: 32,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '605e3229640b730e27314139'
      },
      subscriberId: {
        $oid: '60412a8550f3e485142b1cdc'
      },
      journeyId: {
        $oid: '60412a8750f3e485142b1d0f'
      },
      travelerFullName: 'Christopher Matthew Strongosky',
      organization: {
        type: 'primary',
        name: 'DLA Piper LLP ',
        _id: {
          $oid: '5ee7cc09a95be8b303640d4a'
        }
      },
      flightNumber: '2718',
      carrierName: 'Delta Air Lines',
      departureLocation: {
        _id: {
          $oid: '56cc7143e4b05395d65d3ae0'
        },
        code: 'JAX',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -81.68333435,
            30.5
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616965320000
        },
        estimatedDateTimeDiff: 7,
        gate: 'A9',
        scheduledDateTime: {
          $date: 1616964900000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc7445e4b05395d65d56bc'
        },
        code: 'ATL',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -84.43333435,
            33.63333511
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616969940000
        },
        estimatedDateTimeDiff: 9,
        terminal: 'S',
        gate: 'A27',
        scheduledDateTime: {
          $date: 1616969400000
        }
      },
      status: 'On Time/Delayed',
      productStatus: 'Active',
      delay: 9,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '6043791e50f3e485144da7f7'
      },
      subscriberId: {
        $oid: '5efcc3bba95be8b303b8f5d8'
      },
      journeyId: {
        $oid: '6043791e50f3e485144da796'
      },
      travelerFullName: 'Michael T Hartman',
      organization: {
        type: 'primary',
        name: 'SKF USA ',
        _id: {
          $oid: '5ebd9d27a95be8b30300caa4'
        }
      },
      flightNumber: '2561',
      carrierName: 'American Airlines',
      departureLocation: {
        _id: {
          $oid: '56cc7073e4b05395d65d32ec'
        },
        code: 'FLL',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -80.15000153,
            26.06666756
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616970240000
        },
        estimatedDateTimeDiff: 50,
        terminal: '3',
        gate: 'E5',
        scheduledDateTime: {
          $date: 1616967240000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc6fe0e4b05395d65d2bf6'
        },
        code: 'CLT',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -80.94999695,
            35.21666718
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616977680000
        },
        estimatedDateTimeDiff: 43,
        gate: 'B14',
        baggage: 'B',
        scheduledDateTime: {
          $date: 1616975100000
        }
      },
      status: 'Arrived',
      productStatus: 'Active',
      delay: 50,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '6051a43aec62986255ee7e51'
      },
      subscriberId: {
        $oid: '6051a438ec62986255ee7ca5'
      },
      journeyId: {
        $oid: '6051a439ec62986255ee7ce0'
      },
      travelerFullName: 'Owen David Githanga',
      organization: {
        type: 'primary',
        name: 'Compassion International ',
        _id: {
          $oid: '601184bae9942e4392c177d7'
        }
      },
      flightNumber: '6008',
      operatedByMarketingCarrier: 1,
      carrierName: 'United Airlines',
      departureLocation: {
        _id: {
          $oid: '56cc7359e4b05395d65d53d8'
        },
        code: 'SGF',
        timeZoneCode: 'CST',
        timeZoneName: 'America/Chicago',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -93.3833313,
            37.25
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616969820000
        },
        estimatedDateTimeDiff: 9,
        gate: '7',
        scheduledDateTime: {
          $date: 1616969280000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc701ae4b05395d65d2ea2'
        },
        code: 'DEN',
        timeZoneCode: 'MST',
        timeZoneName: 'America/Denver',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -104.6666641,
            39.86666489
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616976240000
        },
        estimatedDateTimeDiff: -15,
        gate: 'A73',
        baggage: '10',
        scheduledDateTime: {
          $date: 1616977140000
        }
      },
      status: 'On Time/Delayed',
      productStatus: 'Active',
      delay: -15,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '60596e82ec6298625566aed3'
      },
      subscriberId: {
        $oid: '5f0b525ca95be8b303efc33e'
      },
      journeyId: {
        $oid: '60596e82ec6298625566aebb'
      },
      travelerFullName: 'Eric George Goeser',
      organization: {
        type: 'primary',
        name: 'Bracco Diagnostics ',
        _id: {
          $oid: '5ec58d9da95be8b3030cde13'
        }
      },
      flightNumber: '2490',
      carrierName: 'Delta Air Lines',
      departureLocation: {
        _id: {
          $oid: '56cc7445e4b05395d65d56bc'
        },
        code: 'ATL',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -84.43333435,
            33.63333511
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616976720000
        },
        estimatedDateTimeDiff: 17,
        terminal: 'S',
        gate: 'A10',
        scheduledDateTime: {
          $date: 1616975700000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc71f5e4b05395d65d437c'
        },
        code: 'MCO',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -81.31666565,
            28.43333244
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616980860000
        },
        estimatedDateTimeDiff: -4,
        terminal: 'B',
        gate: '71',
        baggage: '31',
        scheduledDateTime: {
          $date: 1616981100000
        }
      },
      status: 'On Time/Delayed',
      productStatus: 'Active',
      delay: 17,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '6060d5e848c73cf513476023'
      },
      subscriberId: {
        $oid: '5ee7cd08a95be8b303641eeb'
      },
      journeyId: {
        $oid: '60423eb850f3e485143b4180'
      },
      travelerFullName: 'Jacob Andrew Lester',
      organization: {
        type: 'primary',
        _id: {
          $oid: '5ee7cd07a95be8b303641e5e'
        },
        name: 'Chesapeake Energy Corporation'
      },
      flightNumber: '4962',
      operatedByMarketingCarrier: 1,
      carrierName: 'Delta Air Lines',
      departureLocation: {
        _id: {
          $oid: '56cc7036e4b05395d65d2ffe'
        },
        code: 'DTW',
        timeZoneCode: 'EST',
        timeZoneName: 'America/Detroit',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -83.34999847,
            42.21666718
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616980200000
        },
        estimatedDateTimeDiff: 11,
        terminal: 'EM',
        gate: 'C9',
        scheduledDateTime: {
          $date: 1616979540000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc704de4b05395d65d3118'
        },
        code: 'ELM',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -76.8833313,
            42.16666794
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616983440000
        },
        estimatedDateTimeDiff: -11,
        scheduledDateTime: {
          $date: 1616984100000
        }
      },
      status: 'On Time/Delayed',
      productStatus: 'Active',
      delay: 11,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '6051a43aec62986255ee7ec5'
      },
      subscriberId: {
        $oid: '6051a438ec62986255ee7ca5'
      },
      journeyId: {
        $oid: '6051a439ec62986255ee7ce0'
      },
      travelerFullName: 'Owen David Githanga',
      organization: {
        type: 'primary',
        name: 'Compassion International ',
        _id: {
          $oid: '601184bae9942e4392c177d7'
        }
      },
      flightNumber: '203',
      carrierName: 'United Airlines',
      departureLocation: {
        _id: {
          $oid: '56cc701ae4b05395d65d2ea2'
        },
        code: 'DEN',
        timeZoneCode: 'MST',
        timeZoneName: 'America/Denver',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -104.6666641,
            39.86666489
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616986980000
        },
        estimatedDateTimeDiff: 78,
        gate: 'C38',
        scheduledDateTime: {
          $date: 1616982300000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc6fede4b05395d65d2c8c'
        },
        code: 'COS',
        timeZoneCode: 'MST',
        timeZoneName: 'America/Denver',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -104.6999969,
            38.79999924
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1616988420000
        },
        estimatedDateTimeDiff: 55,
        gate: '3',
        scheduledDateTime: {
          $date: 1616985120000
        }
      },
      status: 'Arrived',
      productStatus: 'Active',
      delay: 78,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    },
    {
      _id: {
        $oid: '606106a048c73cf5134a6f03'
      },
      subscriberId: {
        $oid: '5ed26abfa95be8b30328ce61'
      },
      journeyId: {
        $oid: '606106a048c73cf5134a6eeb'
      },
      travelerFullName: 'Lane Kidd',
      organization: {
        _id: {
          $oid: '5ec58d9da95be8b3030cde13'
        },
        name: 'Bracco Diagnostics ',
        type: 'primary'
      },
      flightNumber: '514',
      carrierName: 'American Airlines',
      departureLocation: {
        _id: {
          $oid: '56cc701be4b05395d65d2eb2'
        },
        code: 'DFW',
        timeZoneCode: 'CST',
        timeZoneName: 'America/Chicago',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -97.05000305,
            32.90000153
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1617012000000
        },
        estimatedDateTimeDiff: 0,
        terminal: 'C',
        gate: 'C24',
        scheduledDateTime: {
          $date: 1617012000000
        }
      },
      arrivalLocation: {
        _id: {
          $oid: '56cc6fe0e4b05395d65d2bf6'
        },
        code: 'CLT',
        timeZoneCode: 'EST',
        timeZoneName: 'America/New_York',
        geoLocation: {
          type: 'Point',
          coordinates: [
            -80.94999695,
            35.21666718
          ]
        },
        type: 'Airport',
        estimatedDateTime: {
          $date: 1617021060000
        },
        estimatedDateTimeDiff: 0,
        gate: 'C17',
        baggage: 'C',
        scheduledDateTime: {
          $date: 1617021060000
        }
      },
      status: 'Scheduled',
      productStatus: 'Active',
      delay: 0,
      helpedBy: {},
      currentJourneyStatus: 'ok',
      travelerStatus: 'active'
    }
  ],
  embedded: {
    companies: [
      {
        value: '5ec58d9da95be8b3030cde13',
        label: 'Bracco Diagnostics '
      },
      {
        value: '5ee7cd07a95be8b303641e5e',
        label: 'Chesapeake Energy Corporation'
      },
      {
        value: '5ee7cc09a95be8b303640d4a',
        label: 'DLA Piper LLP '
      },
      {
        value: '5f19cf23a95be8b3033696f8',
        label: 'Duane Morris '
      },
      {
        value: '601184bae9942e4392c177d7',
        label: 'Compassion International '
      },
      {
        value: '5ebd9d27a95be8b30300caa4',
        label: 'SKF USA '
      }
    ],
    costCenters: [],
    carriers: [
      {
        value: 'AA',
        label: 'American Airlines'
      },
      {
        value: 'DL',
        label: 'Delta Air Lines'
      },
      {
        value: 'UA',
        label: 'United Airlines'
      }
    ],
    airports: [
      {
        value: 'DFW',
        label: 'Dallas/Fort Worth International'
      },
      {
        value: 'CLT',
        label: 'Charlotte Douglas'
      },
      {
        value: 'DTW',
        label: 'Detroit Metropolitan Wayne County'
      },
      {
        value: 'ELM',
        label: 'Elmira Corning Regional'
      },
      {
        value: 'JAX',
        label: 'Jacksonville'
      },
      {
        value: 'ATL',
        label: 'Hartsfield-jackson Atlanta International'
      },
      {
        value: 'MCO',
        label: 'Orlando International'
      },
      {
        value: 'PHL',
        label: 'Philadelphia International'
      },
      {
        value: 'FLL',
        label: 'Fort Lauderdale/hollywood International'
      },
      {
        value: 'DEN',
        label: 'Denver International'
      },
      {
        value: 'COS',
        label: 'Colorado Springs'
      },
      {
        value: 'SGF',
        label: 'Springfield-Branson Rg'
      }
    ]
  },
  errors: []
};
export default FLIGHT_DATA;
