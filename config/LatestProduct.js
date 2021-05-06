const LATEST_PRODUCT =
{
    'meta': {
      '_returned': 2,
      '_size': 2,
      '_total_pages': 1
    },
    'embedded': {},
    'data': {
      'timelineEvents': [
        {
          'wpId': '60481b9150f3e48514968b91-A',
          'productId': '60481b9150f3e48514968b91',
          'uniqueReservationKey': 'CONF_NUM_35FRZZ_FLIGHT',
          'eventDateTime': 1618610400000,
          'timeZoneName': 'America/Montreal',
          'eventType': 'Flight',
          'eventLabel': 'AC 423, YUL - YYZ',
          'waypointOrder': 1000.1004,
          'productRaw': {
            '_id': {
              '$oid': '60481b9150f3e48514968b91'
            },
            'productType': 'Flight',
            'subscriberId': {
              '$oid': '6024230fe9942e4392d9f9b0'
            },
            'source': 'iQCX',
            'status': 'Active',
            'confirmationNumber': '35FRZZ',
            'recLoc': 'X90MHU',
            'startsAt': {
              '$date': 1618610400000
            },
            'endsAt': {
              '$date': 1618615320000
            },
            'startsAtLocal': {
              '$date': 1618596000000
            },
            'endsAtLocal': {
              '$date': 1618600920000
            },
            'numberOfPassengers': 1,
            'flightNumber': '423',
            'classOfService': 'S',
            'duration': 316,
            'marketingAirline': {
              '_id': {
                '$oid': '56ce4f05e4b05395d65dd575'
              },
              'code': 'AC',
              'accountKey': 'AC',
              'type': 'Airline',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Air Canada',
                  'contacts': [
                    {
                      'name': 'Phone Number',
                      'information': '888-247-2262',
                      'type': 'Phone Number'
                    },
                    {
                      'name': 'Website',
                      'information': 'http://www.aircanada.com/en/customercare/index.html',
                      'type': 'Website'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'name': 'Air Canada'
                }
              ]
            },
            'operatingAirline': {
              '_id': {
                '$oid': '56ce4f05e4b05395d65dd575'
              },
              'code': 'AC',
              'accountKey': 'AC',
              'type': 'Airline',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Air Canada',
                  'contacts': [
                    {
                      'name': 'Phone Number',
                      'information': '888-247-2262',
                      'type': 'Phone Number'
                    },
                    {
                      'name': 'Website',
                      'information': 'http://www.aircanada.com/en/customercare/index.html',
                      'type': 'Website'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'name': 'Air Canada'
                }
              ]
            },
            'startStation': {
              '_id': {
                '$oid': '56cc7554e4b05395d65d6446'
              },
              'code': 'YUL',
              'timeZoneCode': 'EST',
              'timeZoneName': 'America/Montreal',
              'geoLocation': {
                'type': 'Point',
                'coordinates': [
                  -73.74138641,
                  45.46805573
                ]
              },
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Montreal-pierre Elliott Trudeau International Airport',
                  'fullName': 'Montreal, Canada',
                  'locations': [
                    {
                      'city': 'Montreal',
                      'countryCode': 'CA',
                      'countryFull': 'Canada',
                      'stateProvinceCode': 'QC'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'locations': [
                    {}
                  ]
                }
              ],
              'type': 'Airport',
              'estimatedDateTime': {
                '$date': 1618610400000
              },
              'estimatedDateTimeDiff': 0
            },
            'endStation': {
              '_id': {
                '$oid': '56cc755fe4b05395d65d64d6'
              },
              'code': 'YYZ',
              'timeZoneCode': 'EWT',
              'timeZoneName': 'America/Toronto',
              'geoLocation': {
                'type': 'Point',
                'coordinates': [
                  -79.6305542,
                  43.67722321
                ]
              },
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Lester B. Pearson International',
                  'fullName': 'Lester B Pearson Int, Toronto',
                  'locations': [
                    {
                      'city': 'Toronto',
                      'countryCode': 'CA',
                      'countryFull': 'Canada',
                      'stateProvinceCode': 'ON'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'locations': [
                    {}
                  ]
                }
              ],
              'type': 'Airport',
              'estimatedDateTime': {
                '$date': 1618615320000
              },
              'estimatedDateTimeDiff': 0,
              'terminal': '1'
            },
            'journeyId': {
              '$oid': '60242310e9942e4392d9fad1'
            },
            'waypointAOrder': 1000.1004,
            'waypointBOrder': null,
            'createdDate': {
              '$date': 1615338385059
            },
            'updatedDate': {
              '$date': 1617013308723
            },
            'connectionIndicator': 'X',
            'segmentOrder': 3,
            'latestEvent': {},
            'travelerStatus': 'active',
            'travelers': [
              {
                'subscriberId': {
                  '$oid': '6024230fe9942e4392d9f9b0'
                },
                'firstName': 'David John',
                'lastName': 'Alliband'
              }
            ],
            'organization': {
              'type': 'primary',
              'name': 'Belimo Aircontrols Inc (Corporate)',
              '_id': {
                '$oid': '5ee7c8eda95be8b30363fc5a'
              }
            },
            'agencies': [
              {
                'type': 'primary',
                'name': 'World Travel, Inc.',
                '_id': {
                  '$oid': '5e593498a95be8b303898b0d'
                }
              }
            ],
            'travelerFirstName': 'David John',
            'travelerLastName': 'Alliband',
            'travelerFullName': 'David John Alliband',
            'helpedBy': {},
            'currentJourneyStatus': 'ok',
            'currentJourney': {
              'statusId': 0,
              'statusCode': 'ok',
              'reasonProductId': null,
              'dateAdded': {
                '$date': 1615527502231
              }
            },
            'flightState': 'ok',
            'flightStatus': 'Scheduled',
            'delay': 0,
            '_etag': {
              '$oid': '6061aa3c9cb99e65db6fcfae'
            },
            'equipment': {
              '_id': {
                '$oid': '56ce5447e4b05395d65dd938'
              },
              'code': '788',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Boeing 787-8[3]'
                }
              ]
            },
            'updatedDateTime': {
              '$date': 1615527503406
            }
          },
          '_eventDateTimeLow': 1618615320000
        },
        {
          'wpId': '602514bee9942e4392e749bf-A',
          'productId': '602514bee9942e4392e749bf',
          'uniqueReservationKey': 'CONF_NUM_35FRZZ_FLIGHT',
          'eventDateTime': 1618619700000,
          'timeZoneName': 'America/Toronto',
          'eventType': 'Flight',
          'eventLabel': 'AC 856, YYZ - LHR',
          'waypointOrder': 1000.1005,
          'productRaw': {
            '_id': {
              '$oid': '602514bee9942e4392e749bf'
            },
            'productType': 'Flight',
            'subscriberId': {
              '$oid': '6024230fe9942e4392d9f9b0'
            },
            'source': 'iQCX',
            'status': 'Active',
            'confirmationNumber': '35FRZZ',
            'recLoc': 'X90MHU',
            'startsAt': {
              '$date': 1618619700000
            },
            'endsAt': {
              '$date': 1618644900000
            },
            'startsAtLocal': {
              '$date': 1618605300000
            },
            'endsAtLocal': {
              '$date': 1618648500000
            },
            'numberOfPassengers': 1,
            'flightNumber': '856',
            'classOfService': 'S',
            'duration': 3558,
            'marketingAirline': {
              '_id': {
                '$oid': '56ce4f05e4b05395d65dd575'
              },
              'code': 'AC',
              'accountKey': 'AC',
              'type': 'Airline',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Air Canada',
                  'contacts': [
                    {
                      'name': 'Phone Number',
                      'information': '888-247-2262',
                      'type': 'Phone Number'
                    },
                    {
                      'name': 'Website',
                      'information': 'http://www.aircanada.com/en/customercare/index.html',
                      'type': 'Website'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'name': 'Air Canada'
                }
              ]
            },
            'operatingAirline': {
              '_id': {
                '$oid': '56ce4f05e4b05395d65dd575'
              },
              'code': 'AC',
              'accountKey': 'AC',
              'type': 'Airline',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Air Canada',
                  'contacts': [
                    {
                      'name': 'Phone Number',
                      'information': '888-247-2262',
                      'type': 'Phone Number'
                    },
                    {
                      'name': 'Website',
                      'information': 'http://www.aircanada.com/en/customercare/index.html',
                      'type': 'Website'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'name': 'Air Canada'
                }
              ]
            },
            'startStation': {
              '_id': {
                '$oid': '56cc755fe4b05395d65d64d6'
              },
              'code': 'YYZ',
              'timeZoneCode': 'EWT',
              'timeZoneName': 'America/Toronto',
              'geoLocation': {
                'type': 'Point',
                'coordinates': [
                  -79.6305542,
                  43.67722321
                ]
              },
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Lester B. Pearson International',
                  'fullName': 'Lester B Pearson Int, Toronto',
                  'locations': [
                    {
                      'city': 'Toronto',
                      'countryCode': 'CA',
                      'countryFull': 'Canada',
                      'stateProvinceCode': 'ON'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'locations': [
                    {}
                  ]
                }
              ],
              'type': 'Airport',
              'estimatedDateTime': {
                '$date': 1618619700000
              },
              'estimatedDateTimeDiff': 0,
              'terminal': '1'
            },
            'endStation': {
              '_id': {
                '$oid': '56cc71bde4b05395d65d40ba'
              },
              'code': 'LHR',
              'timeZoneCode': 'GMT',
              'timeZoneName': 'Europe/London',
              'geoLocation': {
                'type': 'Point',
                'coordinates': [
                  -0.461388886,
                  51.47750092
                ]
              },
              'language': [
                {
                  'type': 'en_us',
                  'name': 'London Heathrow',
                  'fullName': 'London Heathrow EN, UK',
                  'locations': [
                    {
                      'city': 'London',
                      'countryCode': 'GB',
                      'countryFull': 'United Kingdom'
                    }
                  ]
                },
                {
                  'type': 'default',
                  'locations': [
                    {}
                  ]
                }
              ],
              'type': 'Airport',
              'estimatedDateTime': {
                '$date': 1618644900000
              },
              'estimatedDateTimeDiff': 0,
              'terminal': '2'
            },
            'journeyId': {
              '$oid': '60242310e9942e4392d9fad1'
            },
            'waypointAOrder': 1000.1005,
            'waypointBOrder': null,
            'createdDate': {
              '$date': 1613042878284
            },
            'updatedDate': {
              '$date': 1615527469916
            },
            'connectionIndicator': 'O',
            'segmentOrder': 3,
            'latestEvent': {},
            'travelerStatus': 'active',
            'travelers': [
              {
                'subscriberId': {
                  '$oid': '6024230fe9942e4392d9f9b0'
                },
                'firstName': 'David John',
                'lastName': 'Alliband'
              }
            ],
            'organization': {
              'type': 'primary',
              'name': 'Belimo Aircontrols Inc (Corporate)',
              '_id': {
                '$oid': '5ee7c8eda95be8b30363fc5a'
              }
            },
            'agencies': [
              {
                'type': 'primary',
                'name': 'World Travel, Inc.',
                '_id': {
                  '$oid': '5e593498a95be8b303898b0d'
                }
              }
            ],
            'travelerFirstName': 'David John',
            'travelerLastName': 'Alliband',
            'travelerFullName': 'David John Alliband',
            'helpedBy': {},
            'currentJourneyStatus': 'ok',
            'currentJourney': {
              'statusId': 0,
              'statusCode': 'ok',
              'reasonProductId': null,
              'dateAdded': {
                '$date': 1615527502231
              }
            },
            'flightState': 'ok',
            'flightStatus': 'Scheduled',
            'delay': 0,
            '_etag': {
              '$oid': '604afe4f9cb99e65db67fa7a'
            },
            'equipment': {
              '_id': {
                '$oid': '56ce5447e4b05395d65dd93a'
              },
              'code': '789',
              'language': [
                {
                  'type': 'en_us',
                  'name': 'Boeing 787-9[3]'
                }
              ]
            },
            'updatedDateTime': {
              '$date': 1615527503406
            }
          },
          '_eventDateTimeLow': 1618644900000
        }
      ],
      'reservations': {}
    }
  }

export default LATEST_PRODUCT;