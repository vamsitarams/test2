import moment from 'moment-timezone';

/* eslint-disable new-cap */
import PropTypes from 'prop-types';

import React from 'react';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
// import HelpedBlock from '../../containers/Traveler/HelpedBlock';
import { isCompanyAdminOrUser } from '../../helpers/user';
import config from '../../config';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import FLIGHT_DATA from '../../config/data';
import VendorImage from '../traveler/vendorImage';
// import classNames from 'classnames';

export class FlightsTable extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    getEntireTravelersFlights: PropTypes.func,
    travelersFlights: PropTypes.array.isRequired,
    sortBy: PropTypes.string.isRequired,
    userRole: PropTypes.string,
    sortByDirect: PropTypes.bool.isRequired,
    compact: PropTypes.bool,
    flightsSorter: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      bgColor: ''
    };
  }

  exportToFile = (fileType) => {
    this.props.getEntireTravelersFlights().then((flights) => {
      if (flights) {
        const flightData = this.formatRows(flights);
        console.log(flights);
        if (flightData && flightData.length > 0) {
          if (fileType === 'xlsx') {
            const worksheet = XLSX.utils.json_to_sheet(flightData);
            // console.log(worksheet);
            const workbook = { Sheets: { 'Flight Status': worksheet }, SheetNames: ['Flight Status'] };
            const excelData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            // console.log(excelData);
            const blob = new Blob([excelData], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });

            FileSaver.saveAs(blob, 'FlightStatus.xlsx');
          } else if (fileType === 'pdf') {
            const doc = this.generatePdf(flightData, flights);
            console.log(doc);
            doc.save('FlightStatus.pdf');
          }
        }
      }
    });
  }

  generatePdf(data, flights) {
    const doc = new jsPDF('l', 'pt');
    const width = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const font = doc.getFont();

    doc.setTextColor('#18498F');
    doc.setFont(font.fontName, 'bold');
    doc.setFontSize(18);
    doc.text('Flight Status', width / 2, 40, 'center');
    doc.setFont(font.fontName, '');

    doc.setFontSize(14);
    doc.text('WorldWatch', 40, 70);

    doc.setFontSize(12);
    doc.setFont(font.fontName, 'italic');
    doc.text('Flight Status Report', 40, 90);
    doc.setFont(font.fontName, '');

    doc.setTextColor(0);

    const pdfData = data.map((flight, i) => {
      const departureDateTimeScheduled =
        (!flight['Departure Date (Scheduled)'] || !flight['Departure Time (Scheduled)']) ? ''
          : moment(flight['Departure Date (Scheduled)'] + '-' +
            flight['Departure Time (Scheduled)'], 'M/DD/YYYY-H:mm');
      const departureDateTimeActual =
        (!flight['Departure Date (Est./Actual)'] || !flight['Departure Time (Est./Actual)']) ? ''
          : moment(flight['Departure Date (Est./Actual)'] + '-' +
            flight['Departure Time (Est./Actual)'], 'M/DD/YYYY-H:mm');
      const arrivalDateTimeScheduled =
        (!flight['Arrival Date (Scheduled)'] || !flight['Arrival Time (Scheduled)']) ? ''
          : moment(flight['Arrival Date (Scheduled)'] + '-' +
            flight['Arrival Time (Scheduled)'], 'M/DD/YYYY-H:mm');
      const arrivalDateTimeActual =
        (!flight['Arrival Date (Est./Actual)'] || !flight['Arrival Time (Est./Actual)']) ? ''
          : moment(flight['Arrival Date (Est./Actual)'] + '-' +
            flight['Arrival Time (Est./Actual)'], 'M/DD/YYYY-H:mm');
      const flightStatus = flights[i].status.toLowerCase();
      let delayType = '';

      if (flightStatus === 'cancelled' || flightStatus === 'diverted' ||
        (flights[i].delay && flights[i].delay >
          config.flightStatus.alarmDelayStartMin)) {
        delayType = 'alarm';
      } else if (flights[i].delay && flights[i].delay >=
        config.flightStatus.warningDelayStartMin && flights[i].delay <=
        config.flightStatus.alarmDelayStartMin) {
        delayType = 'warning';
      }

      return {
        DelayColor: (flightStatus === 'canceled' || flights[i].delay > 0) ? 'red' : '',
        DelayType: delayType,
        TravelerName: flight.Traveler + (flight.VIP ? ' (VIP)' : ''),
        Company: flight.Company,
        DepartureEstActualColor: departureDateTimeScheduled && departureDateTimeActual &&
          departureDateTimeActual > departureDateTimeScheduled ? 'red' : '',
        ArrivalEstActualColor: arrivalDateTimeScheduled && arrivalDateTimeActual &&
          arrivalDateTimeActual > arrivalDateTimeScheduled ? 'red' : '',
        DepartureEstActual: departureDateTimeActual && (departureDateTimeActual.format('MMM DD, hh:mm A') +
          ' (' + flights[i].departureLocation.timeZoneCode + ')'),
        ArrivalEstActual: arrivalDateTimeActual && (arrivalDateTimeActual.format('MMM DD, hh:mm A') +
          ' (' + flights[i].arrivalLocation.timeZoneCode + ')'),

        Traveler: flight.Traveler + (flight.VIP ? ' (VIP)' : '') + (flight.Company
          ? '\n' + flight.Company : ''),
        Flight: flight.Flight,
        Carrier: flight.Carrier,
        'O/D': flight['O/D'],
        Scheduled: departureDateTimeScheduled.format('MMM DD, hh:mm A') + '\n' +
          arrivalDateTimeScheduled.format('MMM DD, hh:mm A'),
        'Est./Actual': (departureDateTimeActual && (departureDateTimeActual.format('MMM DD, hh:mm A')) +
          ' (' + flights[i].departureLocation.timeZoneCode + ')') + '\n' +
          (arrivalDateTimeActual && (arrivalDateTimeActual.format('MMM DD, hh:mm A')) +
            ' (' + flights[i].arrivalLocation.timeZoneCode + ')'),
        Status: flight.Status,
        Delay: flight.Delay
        // 'Help Status': '' // flight['Help Status']
      };
    });

    doc.autoTable({
      startY: 110,
      rowPageBreak: 'avoid',
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: 0
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255]
      },
      columns: [{ dataKey: 'Traveler', header: 'Traveler' },
      { dataKey: 'Flight', header: 'Flight' },
      { dataKey: 'Carrier', header: 'Carrier' },
      { dataKey: 'O/D', header: 'O/D' },
      { dataKey: 'Scheduled', header: 'Scheduled' },
      { dataKey: 'Est./Actual', header: 'Est./Actual' },
      { dataKey: 'Status', header: 'Status' },
      { dataKey: 'Delay', header: 'Delay' }],
      // { dataKey: 'Help Status', header: 'Help Status' }],
      // have a fixed size on the Carrier column due to when there is an operating carrier:
      // AMERICAN AIRLINES OPERATED BY REPUBLIC A
      columnStyles: { 2: { cellWidth: 100 } },
      body: pdfData,
      didParseCell: function (data) {
        if (data.row.section === 'body') {
          if (data.row.raw.DelayType === 'alarm') {
            data.cell.styles.fillColor = [255, 231, 231];
          } else if (data.row.raw.DelayType === 'warning') {
            data.cell.styles.fillColor = [255, 248, 225];
          }

          if (data.column.dataKey === 'Delay') {
            if (data.row.raw.DelayColor === 'red') {
              data.cell.styles.textColor = [242, 80, 80];
            } else {
              data.cell.styles.textColor = [73, 191, 120];
            }
          }
        }
      },
      didDrawCell: function (data) {
        if (data.row.section === 'body') {
          if (data.column.dataKey === 'Traveler' || data.column.dataKey === 'Traveler' ||
            data.column.dataKey === 'Est./Actual') {
            if (data.row.raw.DelayType === 'alarm') {
              doc.setFillColor('#FFE7E7');
            } else if (data.row.raw.DelayType === 'warning') {
              doc.setFillColor('#FFF8E1');
            } else {
              doc.setFillColor('#FFFFFF');
            }

            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
          }

          const cellpos = data.cell.getTextPos();
          if (data.column.dataKey === 'Traveler') {
            const font = doc.getFont();

            doc.setFont(font.fontName, 'bold');
            doc.text(data.row.raw.TravelerName, cellpos.x, cellpos.y + 8);

            doc.setFont(font.fontName, '');
            doc.text(data.row.raw.Company, cellpos.x, cellpos.y + 20);
          } else if (data.column.dataKey === 'Est./Actual') {
            if (data.row.raw.DepartureEstActual) {
              if (data.row.raw.DepartureEstActualColor === 'red') {
                doc.setTextColor('#F25050');
              } else {
                doc.setTextColor('#49BF78');
              }

              doc.text(data.row.raw.DepartureEstActual, cellpos.x, cellpos.y + 8);
            }

            if (data.row.raw.ArrivalEstActual) {
              if (data.row.raw.ArrivalEstActualColor === 'red') {
                doc.setTextColor('#F25050');
              } else {
                doc.setTextColor('#49BF78');
              }

              doc.text(data.row.raw.ArrivalEstActual, cellpos.x, cellpos.y + 20);
            }
          }
        }
      }
    });
    return doc;
  }

  sortBy = (sortBy) => () => {
    return this.props.flightsSorter(sortBy);
  }

  sortClass(name) {
    let className = this.props.sortBy === name ? 'sortedBy' : '';
    if (className) {
      className = this.props.sortByDirect ? 'className' : 'up ' + className;
    }
    return 'sortable ' + className;
  }

  formatRows(rows) {
    const { getTimezoneTime, humanizeDuration } = this.context.i18n;

    return rows.map((flight) => {
      let company = flight.organization.name;
      if (isCompanyAdminOrUser(this.props.userRole) && flight.costCenter) {
        company = flight.costCenter.name;
      }

      let departureDateScheduled, departureTimeScheduled, arrivalDateScheduled, arrivalTimeScheduled;
      if (flight.departureLocation.scheduledDateTime.$date && flight.arrivalLocation.scheduledDateTime.$date) {
        departureDateScheduled = getTimezoneTime(flight.departureLocation.scheduledDateTime.$date, 'M/DD/YYYY',
          flight.departureLocation.timeZoneName);
        departureTimeScheduled = getTimezoneTime(flight.departureLocation.scheduledDateTime.$date, 'H:mm',
          flight.departureLocation.timeZoneName);

        arrivalDateScheduled = getTimezoneTime(flight.arrivalLocation.scheduledDateTime.$date, 'M/DD/YYYY',
          flight.arrivalLocation.timeZoneName);
        arrivalTimeScheduled = getTimezoneTime(flight.arrivalLocation.scheduledDateTime.$date, 'H:mm',
          flight.arrivalLocation.timeZoneName);
      }

      const flightStatus = flight.status.toLowerCase();
      let estimatedDeparture = flight.departureLocation.estimatedDateTime.$date;
      let estimatedArrival = flight.arrivalLocation.estimatedDateTime.$date;
      if (!estimatedDeparture) estimatedDeparture = flight.departureLocation.scheduledDateTime.$date;
      if (!estimatedArrival) estimatedArrival = flight.arrivalLocation.scheduledDateTime.$date;

      let departureDateEstActual, departureTimeEstActual, arrivalDateEstActual, arrivalTimeEstActual;
      if (flightStatus !== 'canceled' && estimatedDeparture && estimatedArrival) {
        const depTimeIsDiff = estimatedDeparture !== flight.departureLocation.scheduledDateTime.$date;
        const arrTimeIsDiff = estimatedArrival !== flight.arrivalLocation.scheduledDateTime.$date;
        if (depTimeIsDiff || arrTimeIsDiff || flightStatus === 'landed' || flightStatus === 'in flight') {
          departureDateEstActual = getTimezoneTime(estimatedDeparture, 'M/DD/YYYY',
            flight.departureLocation.timeZoneName);
          departureTimeEstActual = getTimezoneTime(estimatedDeparture, 'H:mm',
            flight.departureLocation.timeZoneName) + ' (' + flight.departureLocation.timeZoneCode + ')';

          arrivalDateEstActual = getTimezoneTime(estimatedArrival, 'M/DD/YYYY', flight.arrivalLocation.timeZoneName);
          arrivalTimeEstActual = getTimezoneTime(estimatedArrival, 'H:mm', flight.arrivalLocation.timeZoneName) +
            ' (' + flight.arrivalLocation.timeZoneCode + ')';
        }
      }

      return {
        Traveler: flight.travelerFullName,
        VIP: flight.isVip,
        Company: company,
        Flight: flight.flightNumber,
        Carrier: (flight.operatedByMarketingCarrier ? 'Operated by ' : '') + flight.carrierName,
        'O/D': flight.departureLocation.code + ' - ' + flight.arrivalLocation.code,
        'Departure Date (Scheduled)': departureDateScheduled,
        'Departure Time (Scheduled)': departureTimeScheduled,
        'Departure Date (Est./Actual)': departureDateEstActual,
        'Departure Time (Est./Actual)': departureTimeEstActual,
        'Arrival Date (Scheduled)': arrivalDateScheduled,
        'Arrival Time (Scheduled)': arrivalTimeScheduled,
        'Arrival Date (Est./Actual)': arrivalDateEstActual,
        'Arrival Time (Est./Actual)': arrivalTimeEstActual,
        Status: flight.status,
        Delay: flight.delay ? humanizeDuration(flight.delay, 'm', 'flight-delay')
          : (flightStatus !== 'cancelled' ? 'On time' : '')
        // 'Help Status': '' // flight.helpedBy
      };
    });
  }

  rows() {
    const { l, getTimezoneTime, getTimezoneDescription, humanizeDuration } = this.context.i18n;

    const rows = this.props.travelersFlights.map((flight) => {
      const vip = flight.isVip ? (<span className='vip'>VIP</span>) : '';
      const blockedStatus = flight.blockedStatus === 'blocked' ? (
        <span className='icon blocked'>{l('blocked')}</span>
      ) : null;
      const operatedByCarrier = flight.operatedByMarketingCarrier ? (
        <div className='light-grey'>{l('Operated by')}</div>
      ) : null;
      const departureTZ = flight.departureLocation.timeZoneName;
      const arrivalTZ = flight.arrivalLocation.timeZoneName;
      const timeFormat = 'MMM D, hh:mm A';
      const scheduledDeparture = flight.departureLocation.scheduledDateTime.$date;
      const scheduledArrival = flight.arrivalLocation.scheduledDateTime.$date;
      let estimatedDeparture = flight.departureLocation.estimatedDateTime.$date;
      let estimatedArrival = flight.arrivalLocation.estimatedDateTime.$date;

      let scheduledTime, scheduledDepartureTime, scheduledArrivalTime;
      if (scheduledDeparture && scheduledArrival) {
        scheduledDepartureTime = getTimezoneTime(scheduledDeparture, timeFormat, departureTZ);
        scheduledArrivalTime = getTimezoneTime(scheduledArrival, timeFormat, arrivalTZ);
        scheduledTime = (
          <div>
            <div><span className='arrow-top'>{l('D')}</span> {scheduledDepartureTime}</div>
            <div><span className='arrow-bottom'>{l('A')}</span> {scheduledArrivalTime}</div>
          </div>
        );
      }
      let estimatedTime;
      const warningDelayStart = config.flightStatus.warningDelayStartMin;
      const alarmDelayStart = config.flightStatus.alarmDelayStartMin;
      const flightDelay = flight.delay;
      const flightStatus = flight.status.toLowerCase();
      let rowClass = '';

      // Set table rows bacgrounds
      if (flightStatus === 'canceled' || flightStatus === 'diverted' ||
        (flightDelay && flightDelay > alarmDelayStart)) {
        rowClass = 'alarm-bg';
      } else if (flightDelay && flightDelay >= warningDelayStart && flightDelay <= alarmDelayStart) {
        rowClass = 'warning-bg';
      } else if (flightStatus === 'landed' || (flightDelay && flightDelay < warningDelayStart)) {
        rowClass = 'normal-bg';
      }

      if (!estimatedDeparture) estimatedDeparture = scheduledDeparture;
      if (!estimatedArrival) estimatedArrival = scheduledArrival;

      if (flightStatus !== 'canceled' && estimatedDeparture && estimatedArrival) {
        const estimatedDepartureTime = getTimezoneTime(estimatedDeparture, timeFormat, departureTZ) +
          ' (' + flight.departureLocation.timeZoneCode + ')';
        const estimatedArrivalTime = getTimezoneTime(estimatedArrival, timeFormat, arrivalTZ) +
          ' (' + flight.arrivalLocation.timeZoneCode + ')';
        const estimatedDepartureTimeTooltip = getTimezoneDescription(estimatedDeparture, departureTZ);
        const estimatedArrivalTimeTooltip = getTimezoneDescription(estimatedArrival, arrivalTZ);
        const depTimeIsDiff = estimatedDepartureTime !== scheduledDepartureTime;
        const arrTimeIsDiff = estimatedArrivalTime !== scheduledArrivalTime;

        if (depTimeIsDiff || arrTimeIsDiff || flightStatus === 'landed' || flightStatus === 'in flight') {
          const departureClass = depTimeIsDiff && estimatedDeparture > scheduledDeparture ? 'red' : 'green';
          const arrivalClass = arrTimeIsDiff && estimatedArrival > scheduledArrival ? 'red' : 'green';
          estimatedTime = (
            <div>
              <div title={estimatedDepartureTimeTooltip} className={departureClass}>
                <span className='arrow-top'>{l('D')}</span> {estimatedDepartureTime}
              </div>
              <div title={estimatedArrivalTimeTooltip} className={arrivalClass}>
                <span className='arrow-bottom'>{l('A')}</span> {estimatedArrivalTime}</div>
            </div>
          );
        }
      }
      // if (flight.delay < 15) {
      //   this.setState({ bgColor: 'bg-white' });
      // } else
      // if (flight.delay > 15) {
      //   this.setState({ bgColor: 'bg-yellow' });
      // } else
      // if (flight.delay > 45) {
      //   this.setState({ bgColor: 'bg-red' });
      // }
      let delay;
      let delayClass = 'red';
      if (flight.delay) {
        const delayFormatted = humanizeDuration(flight.delay, 'm', 'flight-delay');
        let direction;
        if (
          Math.abs(flight.departureLocation.estimatedDateTimeDiff) >
          Math.abs(flight.arrivalLocation.estimatedDateTimeDiff)
        ) {
          direction = <span className='arrow-top'>{l('D')}</span>;
        } else if (
          Math.abs(flight.departureLocation.estimatedDateTimeDiff) <
          Math.abs(flight.arrivalLocation.estimatedDateTimeDiff)
        ) {
          direction = <span className='arrow-bottom'>{l('A')}</span>;
        }
        if (flight.delay < 0) delayClass = 'ok';
        delay = (
          <span>
            {direction}
            <span className={delayClass}>{delayFormatted}</span>
          </span>
        );
      } else if (flight.status.toLowerCase() !== 'canceled') {
        rowClass = 'normal-bg';
        delay = <span className='ok' style={{ paddingLeft: '10px' }} >{l('On time')}</span>;
      }

      let nameTd;
      if (!this.props.compact) {
        let orgName = flight.organization.name;
        if (isCompanyAdminOrUser(this.props.userRole) && flight.costCenter) {
          orgName = flight.costCenter.name;
        }
        nameTd = (
          <td className={this.state.bgColor}>
            {blockedStatus}
            <div className='traveler-info'>
              <div className='name'>
                <Link to={`/traveler/${flight.subscriberId.$oid}`}>
                  {flight.travelerFullName}
                </Link>
                {vip}
              </div>
              <span className='organization'>{orgName}</span>
            </div>
          </td>
        );
        // const helpedBtn = flight.blockedStatus !== 'blocked' ? (
        //   <HelpedBlock helpedBy={flight.helpedBy} travelerId={flight.subscriberId.$oid} />
        // ) : null;

        // helpedByTd = (<td>{helpedBtn}</td>
        // );
      }
      // assign carriers to props once actual data is available
      const sidebarState = this.props.sidebar;

      const carriers = FLIGHT_DATA.embedded.carriers;
      const airlineCode = carriers.filter(carrier => flight.carrierName === carrier.label);
      return (
        <tr key={flight._id.$oid} className={rowClass}>
          {nameTd}
          <td className={this.state.bgColor}><p>{flight.flightNumber}</p></td>
          <td className={this.state.bgColor}>
            {/* <div> */}
            {/* <p>{operatedByCarrier}</p> */}
            <p><VendorImage type='flight' code={airlineCode[0].value} /> {flight.carrierName}</p>
            {/* </div> */}
          </td>
          <td className={this.state.bgColor}>
            <p>
              <div>
                O: {(sidebarState.isOpened || sidebarState.isSidebarPinned) ? flight.departureLocation.code : this.getAirportName(flight.departureLocation.code)}
              </div>
              <div>
                D: {(sidebarState.isOpened || sidebarState.isSidebarPinned) ? flight.arrivalLocation.code : this.getAirportName(flight.arrivalLocation.code)}
              </div>
            </p>
          </td>
          <td className={this.state.bgColor}>
            <p>{scheduledTime}</p>
          </td>
          <td className={this.state.bgColor}>
            <p>{estimatedTime}</p>
          </td>
          <td className={this.state.bgColor}><span className={flight.status.toLowerCase()}>
            <p>{flight.status}</p></span></td>
          <td><p>{delay}</p></td>
        </tr>
      );
    });
    return rows;
  }
  getAirportName(code) {
    const airports = FLIGHT_DATA.embedded.airports;
    const airportName = airports.filter(airport => airport.value === code);
    return airportName[0].label;
  }
  // shouldComponentUpdate(nextProps) {
  //   return (
  //     !isEqual(this.props.travelersFlights, nextProps.travelersFlights) ||
  //     !isEqual(this.props.sortBy, nextProps.sortBy) ||
  //     !isEqual(this.props.userRole, nextProps.userRole) ||
  //     !isEqual(this.props.sortByDirect, nextProps.sortByDirect) ||
  //     !isEqual(this.props.compact, nextProps.compact) ||
  //     !isEqual(this.props.sidebar.isOpened, nextProps.sidebar.isOpened) ||
  //     !isEqual(this.props.sidebar.isSidebarPinned, nextProps.sidebar.isSidebarPinned)
  //   );
  // }

  render() {
    const { l } = this.context.i18n;
    const sidebarState = this.props.sidebar;
    let nameTh;
    if (!this.props.compact) {
      nameTh = (
        <th className={this.sortClass('travelerFullName')} onClick={this.sortBy('travelerFullName')}>
          <span>{l('Traveler')}</span>
        </th>
      );
    }

    return (
      <table className='detail'>
        <thead>
          <tr>
            {nameTh}
            <th className={this.sortClass('flightNumber')} onClick={this.sortBy('flightNumber')}>
              <span>{l('Flight')}</span>
            </th>
            <th className={this.sortClass('segmentCarrier.language.name')}
              onClick={this.sortBy('segmentCarrier.language.name')}>
              <span>{l('Carrier')}</span>
            </th>
            <th className={this.sortClass('departureLocation.code')} onClick={this.sortBy('departureLocation.code')}>
              <span>{(sidebarState.isOpened || sidebarState.isSidebarPinned) ? l('O/D') : l('Origin/Destination')}</span>
            </th>
            <th className={this.sortClass('departureLocation.scheduledDateTime')}
              onClick={this.sortBy('departureLocation.scheduledDateTime')}>
              <span>{l('Scheduled')}</span>
            </th>
            <th className={this.sortClass('departureLocation.estimatedDateTime')}
              onClick={this.sortBy('departureLocation.estimatedDateTime')}>
              <span>{l('Est./Actual')}</span>
            </th>
            <th className={this.sortClass('status')} onClick={this.sortBy('status')}>
              <span>{l('Status')}</span>
            </th>
            <th className={this.sortClass('delay')} onClick={this.sortBy('delay')}>
              <span>{l('Delay')}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {this.rows()}
        </tbody>
      </table>
    );
  }
}

export default FlightsTable;
