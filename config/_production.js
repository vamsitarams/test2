import areas from './areas-list';

export default {
  api: {
    endpoint: 'https://zw00s255q3.execute-api.us-east-1.amazonaws.com/PROD',
    xApiKey: 'S6i51mPGNi7Qotyt7CeuH2zlkNEbIzGP1ZEhqvb7'
  },
  googleAnalytics: {
    apiKey: 'UA-165639831-1'
  },
  links: {
    travelAdvisory: {
      whereCanITravel: 'https://www.covidchecker.com/embed'
    },
    covid19stateRestrictionsPdf: 'https://worldwatch.s3.amazonaws.com/Pdfs/ww-states-restrictions.pdf',
    termsAndConditions: 'https://www.worldtravelinc.com/worldwatch-terms-conditions',
    privacyPolicy: 'https://www.worldtravelinc.com/worldwatch-privacy-policy',
    worldHubAbout: 'https://www.worldtravelinc.com/worldhub'
  },
  locale: {
    defaultLocale: 'en_US',
    supportedLocales: {
      ru_RU: 'Русский',
      en_US: 'English'
    }
  },
  mask: {
    phone: '+0 000-000-0000000000000'
  },
  map: {
    mapAccessToken: 'pk.eyJ1Ijoid29ybGR3YXRjaCIsImEiOiJjazl0eG9mdnAxanJoM2ZydDA5amlqenhsIn0.HhWqeFIGYCeTFBcPcOtv-w',
    mapView: 'mapbox://styles/worldwatch/ckdq35oku0sw61iqrhojv66to',
    minZoom: 3,
    maxZoom: 10,
    alarm: '#F25050',
    ok: '#49BF78',
    warning: '#FFC000',
    timeframes: [0.5, 1, 1.5, 3, 6, 12, 24, 36, 48],
    defaultLat: 40.205781,
    defaultLon: -99.203490
  },
  pusher: {
    ssl: true,
    serviceChannelPrefix: 'service-',
    serviceCommonChannelPrefix: 'service-common',
    notificationPrefix: 'notification-',
    chatChannelPrefix: 'chat_'
  },
  layout: {
    headerHeight: 56,
    travelerDetailsTopBarHeight: 130,
    travelerDetailsNavBarHeight: 39,
    travelerDetailsChatSubmitHeight: 76
  },
  flightStatus: {
    warningDelayStartMin: 16,
    alarmDelayStartMin: 45
  },
  vendorImageUrl: {
    main: 'https://worldwatch.s3.amazonaws.com/VendorImages',
    airlinePath: 'Airlines',
    carRentalPath: 'CarRental',
    lodgingPath: 'Lodging',
    railOperatersPath: 'RailOperaters',
    defaultImageName: 'DEFAULT',
    imgExtension: '.png'
  },
  areas
};
