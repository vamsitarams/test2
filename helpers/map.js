import $ from 'jquery';

import mapboxgl from 'mapbox-gl';

import moment from 'moment';

import uniq from 'lodash/uniq';
import groupBy from 'lodash/groupBy';
import indexOf from 'lodash/indexOf';
import findIndex from 'lodash/findIndex';
import concat from 'lodash/concat';
import flatten from 'lodash/flatten';

import config from '../config';
import i18nTools from '../helpers/i18nTools';
import { sessionStorage } from '../helpers/localStorage';
import { isCompanyAdminOrUser } from '../helpers/user';

import lodashMap from 'lodash/map';

// import { sprintf } from '../i18n/utils';
// import Arc from '../helpers/arc';
// const { getTimezoneTime, l } = i18nTools;

mapboxgl.accessToken = config.map.mapAccessToken;

export const createMap = (containerID, centerLongitude, centerLatitude, initialZoom) => {
  if (!centerLongitude) {
    centerLongitude = config.map.defaultLon;
  }

  if (!centerLatitude) {
    centerLatitude = config.map.defaultLat;
  }

  if (!initialZoom) {
    initialZoom = config.map.minZoom;
  }

  const newMap = new mapboxgl.Map({
    container: containerID,
    center:
    [
      centerLongitude,
      centerLatitude
    ],
    style: config.map.mapView,
    zoom: initialZoom,
    minZoom: config.map.minZoom,
    maxZoom: config.map.maxZoom,
    attributionControl: false,
    logoPosition: 'top-right'
  });

  const nav = new mapboxgl.NavigationControl();
  newMap.addControl(nav, 'bottom-left');

  return newMap;
};

export const drawAirportStatusesHelper = (airportMarkers, airportStatuses, map, timeFilter, pageType) => {
  airportStatuses.forEach(airport => {
    if (!parseFloat(airport.geoLocation.latitude) || !parseFloat(airport.geoLocation.longitude)) {
      return;
    }

    const airportCode = (airport.code ? '<span class="airport-code">' + airport.code + '</span>' : '');

    // OLD MARKER CODE, delete me
    // let markerIcon = L.divIcon({
    //   className: 'airport-marker ' + (airport.status && airport.status.color ? airport.status.color : 'none'),
    //   html: '<div class="bullet"></div>' + airportCode,
    //   iconSize: [12, 12],
    //   ids: uniq(lodashMap(airport.travelersIn || airport.travelers, '_id.$oid'))
    // });

    const ids = uniq(lodashMap(airport.travelersIn || airport.travelers, '_id.$oid'));
    const markerElement = document.createElement('div');
    markerElement.className =
      'airport-marker ' + (airport.status && airport.status.color ? airport.status.color : 'none');
    markerElement.html = '<div class="bullet"></div>' + airportCode;
    markerElement.style.width = '12px';
    markerElement.style.height = '12px';
    markerElement.ids = ids;

    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat([airport.geoLocation.longitude, airport.geoLocation.latitude])
      .addTo(map);

    // OLD MARKER CODE, delete me
    // const marker = L.marker([airport.geoLocation.latitude, airport.geoLocation.longitude], {
    //   icon: markerIcon
    // }).addTo(map);

    airportMarkers.push(marker);

    // TODO: mapbox-gl POPUP
    // let travelersLength = uniq(ids).length;
    // const hoursLables = {
    //   48: l('48 hours'),
    //   36: l('36 hours'),
    //   24: l('24 hours'),
    //   12: l('12 hours'),
    //   6: l('6 hours'),
    //   3: l('3 hours'),
    //   1.5: l('90 min'),
    //   1: l('60 min'),
    //   0.5: l('30 min')
    // };
    // travelersLength = sprintf(i18nTools.ngettext('%d traveler', '%d travelers', travelersLength), travelersLength);
    // let travelersNumberHtml = '';
    // if (pageType === 'active-travelers') {
    //   travelersNumberHtml = `
    //     <span class="user-icon">${travelersLength} ${i18nTools.l('within')} ${hoursLables[timeFilter]}</span>
    //   `;
    // }

    // const city = airport.language && airport.language[0].locations ? airport.language[0].locations[0].city : '';
    // marker.bindPopup(`
    //       <div class="popup-heading">
    //         <strong>${airport.code} - ${city}</strong>
    //       </div>
    //       <div class="area">
    //         <span class='airport-status ${airport.status.color}'>
    //             ${airport.status ? airport.status.message || airport.status.reason : ''}
    //           </span>
    //         ${travelersNumberHtml}
    //       </div>
    //     `, { closeButton: false, autoPanPaddingTopLeft: mapboxgl.Point(0, 110), offset: mapboxgl.Point(0, -3) });
    // marker.on('mouseover', function () {
    //   this.openPopup();
    // });
    // marker.on('mouseout', function () {
    //   this.closePopup();
    // });
    // END mapbox-gl POPUP
  });

  return airportMarkers;
};

export const getClusterInformationMarkersStatus = (markers) => {
  return groupBy(markers, 'options.icon.options.status');
};

export const drawLocationsHelper = (travelers, map, userRole) => {
  if (!travelers.length && travelers._id) {
    travelers = [travelers];
  }

  if (!travelers.length) {
    return false;
  }

  // TODO: mapbox-gl MARKER cluster
  // let markerClusterGroup = new L.MarkerClusterGroup({
  //   showCoverageOnHover: false,
  //   iconCreateFunction: (cluster) => {
  //     const clusterCount = cluster.getChildCount();
  //     const className = clusterCount < 100 ? 'big' : (clusterCount < 1000 ? 'bigger' : 'bigest');
  //     const lPoint = clusterCount < 100 ? L.point(21, 21) :
  //       (clusterCount < 1000 ? L.point(27, 27) : L.point(33, 33));
  //     let clusterIcon = L.divIcon({
  //       className: 'cluster ' + className,
  //       html: clusterCount,
  //       iconSize: lPoint
  //     });
  //     return clusterIcon;
  //   }
  // });
  // // add markers to claster group
  // travelers.forEach((traveler) => {
  //   let markerIcon = L.divIcon({
  //     className: traveler.currentJourneyStatus,
  //     status: traveler.currentJourneyStatus,
  //     id: traveler._id.$oid
  //   });

  //   if (!traveler.geoLocation || !traveler.geoLocation.latitude || !traveler.geoLocation.longitude) {
  //     return;
  //   }

  //   let marker = L.marker(
  //     [traveler.geoLocation.latitude, traveler.geoLocation.longitude],
  //     {icon: markerIcon}
  //   );
  //   const isVip = traveler.isVIP ? '<span class="vip">VIP</span>' : '';
  //   const productDate = traveler.geoLocation.date.$date;
  //   const productTz = traveler.geoLocation.timeZoneName;
  //   const productType = traveler.geoLocation.event_type;
  //   const productName = traveler.geoLocation.name;
  //   const productFormattedDate = getTimezoneTime(productDate, 'MMM D, hh:mm A', productTz);
  //   const costCenterName = traveler.costCenter && traveler.costCenter.name ? traveler.costCenter.name : '';
  //   const orgName = isCompanyAdminOrUser(userRole) ? costCenterName : traveler.organization.name;
  //   const popupHtml = `
  //     <div class="popup-heading">
  //       <span class='${traveler.currentJourneyStatus} icon'>${traveler.currentJourneyStatus}</span>
  //       <div class="holder">
  //         <div class="name-area">
  //           <strong class="travelers-name">${traveler.firstName} ${traveler.lastName}</strong>
  //           ${isVip}
  //         </div>
  //         <span class="travelers-organization">${orgName}</span>
  //       </div>
  //     </div>
  //     <div class="area">
  //       <span class="muted">${productFormattedDate}</span>
  //       <span>${productType} - ${productName}</span>
  //     </div>
  //   `;

  //   TODO: mapbox-gl POPUP
  //   marker.bindPopup(popupHtml, {
  //     closeButton: false,
  //     offset: L.point(0, -3),
  //     autoPanPaddingTopLeft: L.point(0, 70)
  //   });
  //   marker.on('mouseover', function () {
  //     this.openPopup();
  //   });
  //   marker.on('mouseout', function () {
  //     // this.closePopup();
  //   });
  //   markerClusterGroup.addLayer(marker);
  // });

  // markerClusterGroup.popup = L.popup({
  //   closeButton: false,
  //   maxWidth: 110,
  //   minWidth: 110,
  //   offset: L.point(0, -3),
  //   autoPanPaddingTopLeft: L.point(0, 70)
  // });

  // markerClusterGroup.on('clustermouseover', (a) => {
  //   // a.layer is actually a cluster
  //   const groups = getClusterInformationMarkersStatus(a.layer.getAllChildMarkers());
  //   let ok = '';
  //   if (groups.ok) {
  //     const okText = sprintf(i18nTools.ngettext('%d traveler', '%d travelers', groups.ok.length), groups.ok.length);
  //     ok = `<li><span class='icon ok'>ok</span> ${okText}</li>`;
  //   }
  //   let warning = '';
  //   if (groups.warning) {
  //     const warningText = sprintf(
  //       i18nTools.ngettext('%d traveler', '%d travelers', groups.warning.length),
  //       groups.warning.length
  //     );
  //     warning = `<li><span class='icon warning'>warning</span> ${warningText}</li>`;
  //   }
  //   let alarm = '';
  //   if (groups.alarm) {
  //     const alarmText = sprintf(
  //       i18nTools.ngettext('%d traveler', '%d travelers', groups.alarm.length),
  //       groups.alarm.length
  //     );
  //     alarm = `<li><span class='icon alarm'>alarm</span> ${alarmText}</li>`;
  //   }
  //   markerClusterGroup.popup
  //     .setContent(`<ul>${alarm}${warning}${ok}</ul>`)
  //     .setLatLng(a.latlng).openOn(map);
  // });
  // markerClusterGroup.on('clustermouseout', () => {
  //   markerClusterGroup.popup._close();
  // });
  // markerClusterGroup.on('clusterclick', () => {
  //   markerClusterGroup.popup._close();
  // });

  // // add claster to map
  // map.addLayer(markerClusterGroup);

  // return markerClusterGroup;
};

export const drawCountriesBorders = (countriesJSON, countries, map) => {
  if (!countries.length) {
    return null;
  }

  // TODO: mapbox-gl GEOJSON
  // const layer = L.geoJson(countriesJSON, {
  //   style: function (feature) {
  //     const currentCountry = countries.find(
  //       country => country.longCode === feature.id || country.country === feature.properties.name
  //     );
  //     const level = currentCountry ? currentCountry.level : null;
  //     switch (level) {
  //       case 1:
  //         return { color: '#ff0000', opacity: 0, fillColor: '#376dc0', fillOpacity: 0.5 };
  //       case 2:
  //         return { color: '#ff0000', opacity: 0, fillColor: '#edd21e', fillOpacity: 0.5 };
  //       case 3:
  //         return { color: '#ff0000', opacity: 0, fillColor: '#dd8107', fillOpacity: 0.5 };
  //       case 4:
  //         return { color: '#ff0000', opacity: 0, fillColor: '#d14830', fillOpacity: 0.5 };
  //       default:
  //         return { color: '#ff0000', opacity: 0, fillColor: '#fff', fillOpacity: 0 };
  //     }
  //   }
  // }).addTo(map);
  // return layer;
};

export const drawTravelAdvisoryHelper = (countries, map, clickCb) => {
  if (!countries.length) {
    return null;
  }

  // TODO: mapbox-gl MARKER cluster
  // let markerClusterGroup = new L.MarkerClusterGroup({
  //   showCoverageOnHover: false,
  //   iconCreateFunction: (cluster) => {
  //     const clusterCount = cluster.getChildCount();
  //     let clusterIcon = L.divIcon({
  //       className: 'ta-marker small',
  //       html: clusterCount,
  //       iconSize: L.point(20, 20)
  //     });
  //     return clusterIcon;
  //   }
  // });

  // // add markers to claster group
  // countries.forEach(countryObg => {
  //   const { center, travelers, country } = countryObg;
  //   const travelersLength = travelers && Object.keys(travelers).length;
  //   if (
  //     center &&
  //     center.coords &&
  //     travelersLength
  //   ) {
  //     let markerIcon = L.divIcon({
  //       id: country,
  //       className: 'ta-marker',
  //       iconSize: L.point(travelersLength < 10 ? 42 : travelersLength < 100 ? 46 : 52, 20),
  //       html: `<span>${travelersLength} <i class='travelers' /></span>`
  //     });

  //     let marker = L.marker(
  //       center.coords,
  //       {icon: markerIcon}
  //     );
  //     marker.on('click', () => {
  //       clickCb(countryObg);
  //     });
  //     markerClusterGroup.addLayer(marker);
  //   }
  // });

  // map.addLayer(markerClusterGroup);

  // return markerClusterGroup;
};

export const getVisibleMarkersHelper = (map, markerClusterGroup, airportMarkers, flightsArcs) => {
  const bounds = map.getBounds();
  let inBounds = [];

  if (markerClusterGroup && map.hasLayer(markerClusterGroup)) {
    markerClusterGroup.eachLayer((marker) => {
      if (bounds.contains(marker.getLatLng())) {
        inBounds.push(marker.options.icon.options.id);
        inBounds = uniq(inBounds);
      }
    });
  }

  if (airportMarkers.length) {
    airportMarkers.forEach((marker) => {
      if (bounds.contains(marker.getLatLng())) {
        inBounds = uniq(concat(inBounds, marker.options.icon.options.ids));
      }
    });
  }

  if (flightsArcs && flightsArcs.airportMarkers && flightsArcs.airportMarkers.length) {
    flightsArcs.airportMarkers.forEach((marker) => {
      if (bounds.contains(marker.getLatLng())) {
        inBounds = uniq(concat(inBounds, marker.options.icon.options.ids));
      }
    });
  }

  return inBounds;
};

// TODO: mapbox-gl POLYLINE
// const createPoint = (coordinates) => {
//   return {
//     y: coordinates[1],
//     x: coordinates[0]
//   };
// };

export const drawFlightStatusesArcsHelper = (
  flightsStatuses,
  filteredTravelers,
  map,
  pinePopup,
  shouldShowEnotherPopup,
  userRole) => {
  // collect airports to draw
  const airportsCoords = flightsStatuses.map(departure => {
    if (!departure.geoLocation) return false;
    const allFlights = departure.destinations.map(destination => {
      return destination.flights;
    });
    return {
      code: departure.code,
      subscribersIds: departure.subscribersIds,
      coords: departure.geoLocation && departure.geoLocation.coordinates,
      flights: flatten(allFlights)
    };
  });

  let arcsLines = [];
  flightsStatuses.forEach(departure => {
    departure.destinations.forEach(destination => {
      if (!destination.geoLocation) {
        return false;
      }

      // collect arcs
      const reverseCode = `${destination.code} - ${departure.code}`;
      const index = findIndex(arcsLines, { code: reverseCode });
      const code = `${departure.code} - ${destination.code}`;

      if (index !== -1 && destination.flights.length) {
        arcsLines[index].reverseCode = code;
        arcsLines[index].reverseFlights = destination.flights;
        arcsLines[index].rDepCode = destination.code;
        arcsLines[index].rDesCode = departure.code;
      } else if (destination.flights.length) {
        arcsLines.push({
          code: code,
          depCode: departure.code,
          desCode: destination.code,
          flights: destination.flights,
          depCoords: departure.geoLocation && departure.geoLocation.coordinates,
          desCoords: destination.geoLocation && destination.geoLocation.coordinates,
          subscriberIds: departure.subscribersIds
        });
      }

      // collect destination airports if not exist in departure
      const airportIndex = findIndex(airportsCoords, { code: destination.code });
      if (airportIndex === -1) {
        airportsCoords.push({
          code: destination.code,
          flights: destination.flights,
          subscribersIds: destination.subscribersIds,
          coords: destination.geoLocation.coordinates
        });
      } else {
        airportsCoords[airportIndex].subscribersIds = uniq([
          ...airportsCoords[airportIndex].subscribersIds,
          ...destination.subscribersIds
        ]);
        airportsCoords[airportIndex].flights = [
          ...airportsCoords[airportIndex].flights,
          ...destination.flights
        ];
      }
    });
  });

  const arcs = [];
  const travelerCountArray = [];
  // TODO: mapbox-gl POLYLINE
  // arcsLines.forEach((arc) => {
  //   let popupWidth = 300;
  //   if (!arc || !arc.depCoords || !arc.depCoords.length) {
  //     console.error(arc.code + ' - Flight status incorect coordinates');
  //     return false;
  //   }

  //   let flights = arc.flights;
  //   let rFlights = arc.reverseFlights;
  //   let allFlights = false;
  //   if (arc.reverseFlights) {
  //     allFlights = [...flights, ...rFlights];
  //   } else {
  //     allFlights = flights;
  //   }

  //   const statuses = uniq(lodashMap(allFlights || flights, ({flightState}) => flightState));

  // let color = config.map.ok;
  // if (indexOf(statuses, 'warning') !== -1) {
  //   travelerCountArray = travelerCountArray.concat(arc.subscriberIds);
  //   color = config.map.warning;
  // }

  // if (indexOf(statuses, 'alarm') !== -1) {
  //   travelerCountArray = travelerCountArray.concat(arc.subscriberIds);
  //   color = config.map.alarm;
  // }

  // const generator = new Arc.GreatCircle(
  //   createPoint(arc.depCoords), createPoint(arc.desCoords)
  // );

  // const generatorReverse = new Arc.GreatCircle(
  //   createPoint(arc.desCoords), createPoint(arc.depCoords)
  // );

  // const line = generator.Arc(40, { offset: 0 });
  // let lineReverse = generatorReverse.Arc(40, { offset: 0 });
  // lineReverse = L.polyline(
  //   lineReverse.geometries[0].coords.map(c => c.reverse()),
  //   {
  //     color: color,
  //     weight: 1,
  //     opacity: 1
  //   }
  // ).addTo(map);

  // const newLine = L.polyline(
  //   line.geometries[0].coords.map(c => c.reverse()),
  //   {
  //     color: color,
  //     weight: 1,
  //     opacity: 1
  //   }
  // ).addTo(map);

  //   if (newLine && lineReverse) {
  //     let popupContent = '';
  //     if ((!allFlights || allFlights.length === 1) && flights.length === 1) {
  //       popupContent = getFlightPopupContent(flights[0], filteredTravelers, userRole);
  //     } else {
  //       popupWidth = 400;
  //       let flightsList = flights.map((flight) => getFlightListItem(flight)).join('');
  //       let rFlightsList = rFlights ? rFlights.map((flight) => getFlightListItem(flight)).join('') : false;
  //       let flightsContent = '';
  //       if (allFlights.length) {
  //         flightsContent = allFlights.map((flight) => {
  //           return getFlightPopupContent(flight, filteredTravelers, userRole);
  //         }).join('');
  //       }
  //       flightsList = flightsList ? `<h3>${arc.code}</h3><ul>${flightsList}</ul>` : '';
  //       rFlightsList = rFlightsList ? `<h3>${arc.reverseCode}</h3><ul>${rFlightsList}</ul>` : '';
  //       popupContent = `
  //         <div id="popup-flights">
  //           <div class="tabset">
  //             ${flightsList}
  //             ${rFlightsList}
  //           </div>
  //           <div class="tabs-holder">${flightsContent}</div>
  //         </div>
  //       `;
  //     }

  //     const popup = L.DomUtil.create('div', 'arc-popup');
  //     popup.innerHTML = popupContent;
  //     L.DomEvent.addListener(popup, 'click', () => {
  //       pinePopup(newLine, lineReverse);
  //     });

  //     newLine.popup = L.popup({
  //       minWidth: popupWidth,
  //       maxWidth: popupWidth,
  //       closeButton: false,
  //       autoPanPaddingTopLeft: L.point(0, 110)
  //     }).setContent(popup);

  //     lineReverse.popup = L.popup({
  //       minWidth: popupWidth,
  //       maxWidth: popupWidth,
  //       closeButton: false,
  //       autoPanPaddingTopLeft: L.point(0, 110)
  //     }).setContent(popup);

  //     newLine.on('mouseover', (e) => {
  //       shouldShowEnotherPopup() && newLine.popup.setLatLng(e.latlng).openOn(map);
  //       initTabs();
  //     });

  //     lineReverse.on('mouseover', (e) => {
  //       shouldShowEnotherPopup() && lineReverse.popup.setLatLng(e.latlng).openOn(map);
  //       initTabs();
  //     });

  //     arcs.push(lineReverse);
  //     arcs.push(newLine);
  //   }
  // });

  arcsLines = null; // why??

  const uniqueTravelerCount = new Set(travelerCountArray);
  sessionStorage.set('TravelerCount', uniqueTravelerCount.size);

  map.on('popupclose', (e) => {
    const arc = arcs.find(arc => e.popup === arc.popup);
    if (arc) {
      arc.setStyle({ weight: 1 });
    }
  });

  map.on('popupopen', (e) => {
    const arc = arcs.find(arc => e.popup === arc.popup);
    if (arc) {
      arc.setStyle({ weight: 2 });
    }
  });

  const airportMarkers = drawAirports(airportsCoords, map);

  return {
    arcs,
    airportMarkers
  };
};

const drawAirports = (airportsCoords, map) => {
  const airportMarkers = [];
  airportsCoords.forEach(airportCoord => {
    if (!airportCoord.flights || !airportCoord.flights.length) {
      return;
    }

    const coords = airportCoord.coords;
    // let markerIcon = L.divIcon({
    //   className: 'airport',
    //   ids: flatten(airportCoords.flights.map(flight => flight.subscribersIds)),
    //   iconSize: [10, 10]
    // });

    // let marker = L.marker([coords[1], coords[0]], {
    //   icon: markerIcon
    // }).addTo(map);

    const el = document.createElement('div');
    el.className = 'airport';
    el.style.width = '10px';
    el.style.height = '10px';
    el.ids = flatten(airportCoord.flights.map(flight => flight.subscribersIds));

    const marker = new mapboxgl.Marker(el)
      .setLngLat([coords[1], coords[0]])
      .addTo(map);

    airportMarkers.push(marker);
  });

  return airportMarkers;
};

export const getFlightPopupContent = (flight, filteredTravelers, userRole) => {
  const timeFormat = 'MMM D|hh:mm A';
  if (!(flight.arrivalLocation && flight.departureLocation)) {
    console.error(flight.number + i18nTools.l(' - Flight status - incorrect flight information'));
    return false;
  }

  const departureTZ = flight.departureLocation.timeZoneName;
  const arrivalTZ = flight.arrivalLocation.timeZoneName;
  const departureTime = flight.departureLocation.scheduledDateTime.$date;
  const arrivalTime = flight.arrivalLocation.scheduledDateTime.$date;
  const eDepartureTime = flight.departureLocation.estimatedDateTime.$date;
  const eArrivalTime = flight.arrivalLocation.estimatedDateTime.$date;
  const scheduledDepartureTime = i18nTools.getTimezoneTime(departureTime, timeFormat, departureTZ).split('|');
  const scheduledArrivalTime = i18nTools.getTimezoneTime(arrivalTime, timeFormat, arrivalTZ).split('|');

  let estimatedDepartureTime = false;
  let estimatedArrivalTime = false;
  if (departureTime !== eDepartureTime) {
    estimatedDepartureTime = i18nTools.getTimezoneTime(eDepartureTime, timeFormat, departureTZ).split('|');
    if (scheduledDepartureTime[0] === estimatedDepartureTime[0]) {
      scheduledDepartureTime[0] = '';
    }
  }

  if (arrivalTime !== eArrivalTime) {
    estimatedArrivalTime = i18nTools.getTimezoneTime(eArrivalTime, timeFormat, arrivalTZ).split('|');
    if (scheduledArrivalTime[0] === estimatedArrivalTime[0]) {
      scheduledArrivalTime[0] = '';
    }
  }

  const travelers = uniq(flight.subscribers.map((traveler) => {
    const organization = traveler.organization ? traveler.organization.name : '';
    const costCenterName = traveler.costCenter && traveler.costCenter.name ? traveler.costCenter.name : '';
    const orgName = isCompanyAdminOrUser(userRole) ? costCenterName : organization;

    const isVip = indexOf(traveler.rank, 'VIP') !== -1 ? '<span class="vip">VIP</span>' : '';
    if (findIndex(filteredTravelers, ['_id.$oid', traveler._id.$oid]) === -1) return '';
    return `
      <li>${traveler.firstName} ${traveler.lastName}
       &middot; <span class='comp-name'> ${orgName}</span> ${isVip}</li>
    `;
  })).join('');

  let status = flight.status;
  if (flight.delay) {
    status = `
      ${i18nTools.humanizeDuration(flight.delay, 'm', 'flight-delay').replace('-', '')}
      ${flight.delay > 0 ? i18nTools.l('delay') : i18nTools.l('early')}
    `;
  }

  return `
    <div class="tab" id="${flight.number}">
      <div class='head'>
        <h4>${flight.number} ${flight.carrier.name} ${fly(flight)}</h4>
        <strong class="${flight.delay >= 0 ? flight.flightState : 'ok'}">${status}</strong>
      </div>
      <div class='dep-des'>
        <div class='holder'>
          <div class='arrow_box'>
              <span>${flight.departureLocation.code}</span><br />
              <strong>
                ${estimatedDepartureTime ? estimatedDepartureTime.join('<br/>') : scheduledDepartureTime.join('<br/>')}
              </strong>
              <del>${estimatedDepartureTime ? scheduledDepartureTime.join('<br/>') : ''}</del>
          </div>
          <div>
              <span>${flight.arrivalLocation.code}</span><br />
              <strong>
                ${estimatedArrivalTime ? estimatedArrivalTime.join('<br/>') : scheduledArrivalTime.join('<br/>')}
              </strong>
              <del>${estimatedArrivalTime ? scheduledArrivalTime.join('<br/>') : ''}</del>
          </div>
        </div>
        <ul class='popup-travelers-list'>
          ${travelers}
        </ul>
      </div>
    </div>
  `;
};

export const getFlightListItem = (flight) => {
  return `
    <li class="flight-item" data-id="${flight.number}">
      <span>${flight.carrier.code} ${flight.number} ${fly(flight)}</span>
      <strong class="${flight.flightState}">${flight.status}</strong>
    </li>
  `;
};

const fly = (flight) => {
  const flightStatus = flight.status.toLowerCase();
  if (flightStatus !== 'canceled') {
    const nowUTC = moment().utc().valueOf();
    const eDepartureTime = flight.departureLocation.estimatedDateTime.$date;
    const eArrivalTime = flight.arrivalLocation.estimatedDateTime.$date;
    return (nowUTC > eDepartureTime && nowUTC < eArrivalTime) ? '<em class="fly">fly</em>' : '';
  }
  return '';
};

// TODO: mapbox-gl POPUP/POLYLINE
// const initTabs = () => {
//   const $popupFlights = $('#popup-flights');
//   if ($popupFlights.length) {
//     const $tabs = $popupFlights.find('div.tab');
//     let minHeight = 0;
//     $tabs.each((i, tab) => {
//       const tabHeight = $(tab).height();
//       if (minHeight < tabHeight) {
//         minHeight = tabHeight;
//       }
//     });
//     $popupFlights.find('div.flight-item:first').addClass('active');
//     $tabs.css('minHeight', minHeight).hide().eq(0).show();
//   }
// };

export const popupTabsInit = () => {
  $(document.body).off('mouseenter.tabs');
  $(document.body).on('mouseenter.tabs', 'li.flight-item', function (e) {
    const $popupFlights = $('#popup-flights');
    $popupFlights.find('div.flight-item').removeClass('active');
    $popupFlights.find('div.tab').hide();
    $(this).addClass('active');
    $popupFlights.find('#' + $(this).data('id')).show();
  });
};

export const clearMap = (map, markerClusterGroup, airportMarkers, flightsArcs, doNotClosePopup) => {
  if (!doNotClosePopup) {
    // TODO: mapbox-gl POPUP
    // map.closePopup();
  }

  // remove locations
  if (markerClusterGroup && map.hasLayer(markerClusterGroup)) {
    map.removeLayer(markerClusterGroup);
    markerClusterGroup = null;
  }

  // remove airport statuses
  if (airportMarkers.length) {
    airportMarkers.forEach((marker) => {
      map.removeLayer(marker);
    });
    airportMarkers = [];
  }

  // remove arcs
  if (flightsArcs) {
    if (flightsArcs.arcs) {
      flightsArcs.arcs.forEach((arc) => {
        map.removeLayer(arc);
      });
    }

    if (flightsArcs.airportMarkers) {
      flightsArcs.airportMarkers.forEach((airport) => {
        map.removeLayer(airport);
      });
    }
    flightsArcs = null;
  }

  return {
    markerClusterGroup,
    airportMarkers,
    flightsArcs
  };
};
