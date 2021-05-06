import PropTypes from 'prop-types';
import React from 'react';
import Select from '../../components/common/select/Select';
// import find from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import { sprintf } from '../../i18n/utils';
import { isCompanyAdminOrUser } from '../../helpers/user';
import $ from 'jquery';
import { sessionStorage } from '../../helpers/localStorage';
import DatePicker from 'react-datepicker';
import { CollapseHolder, CollapseOpener, CollapseBlock } from '../../components/common/collapse';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import SettingsView from '../../views/SettingsView/SettingsView';
// import TfilterIcon from './svgIcon/TfilterIcon';
// import Main from '../activeTravelers/datePicker';
// import DownlaodIcon from './svgIcon/DownloadIcon';
import Download from '../../styles/images/Download.svg';
// import Leaf from '../../styles/images/Leaf.svg';
import FiltersActive from '../../styles/images/FiltersActive.svg';
import Filter from '../../styles/images/Filter.svg';
import PDF from '../../styles/images/PDF.svg';
import XLS from '../../styles/images/XLS.svg';
import HamburgerIcon from '../../styles/images/HamburgerIcon.svg';

export class TravelersFilter extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelers: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    filteredTravelers: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
    companyList: PropTypes.array.isRequired,
    userRole: PropTypes.string.isRequired,
    costCenterList: PropTypes.array,
    carrierList: PropTypes.array,
    airportList: PropTypes.array,
    flightStatusList: PropTypes.array,
    setTravelersFilter: PropTypes.func.isRequired,
    travelersFilter: PropTypes.object.isRequired,
    clearTravelersFilter: PropTypes.func.isRequired,
    hideStatusFilter: PropTypes.any,
    title: PropTypes.any,
    exportToFile: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {
      alarm: false
    };
    this._vipRef = React.createRef();
    this._alarmRef = React.createRef();
    this._warningRef = React.createRef();
    this._okRef = React.createRef();
    this._nonHelpedRef = React.createRef();
    this._dateRangeTypeOptions = ['Custom'];
    this._selectDefault = [];
    this._dateRangeType = this.props.travelersFilter.dateRangeType;
    this._dateRangeStart = this.props.travelersFilter.dateRangeStart;
    this._dateRangeEnd = this.props.travelersFilter.dateRangeEnd;
    this._company = this.props.travelersFilter.company;
    this._carrier = this.props.travelersFilter.carrier;
    this._airport = this.props.travelersFilter.airport;
    this._fstatus = this.props.travelersFilter.fstatus;
    this._costcenter_id = this.props.travelersFilter.costcenter_id;
  }

  clear = (e) => {
    e.preventDefault();
    this.props.clearTravelersFilter();
    this._company = this._selectDefault;
    this._carrier = this._selectDefault;
    this._airport = this._selectDefault;
    this._fstatus = this._selectDefault;
    this._costcenter_id = this._selectDefault;
  }

  exportToExcel = (e) => {
    console.log(this.exportToExcel);
    this.props.exportToFile('xlsx');
  }

  exportToPdf = (e) => {
    this.props.exportToFile('pdf');
  }

  dateRangeChange = (e) => {
    return (selected) => {
      this._dateRangeType = selected.value;
      switch (selected.value) {
        // case 'Current':
        //   this._dateRangeStart = moment().local().startOf('day');
        //   this._dateRangeEnd = moment().local().endOf('day');
        //   break;
        // case 'Last 7 Days':
        //   this._dateRangeStart = moment().local().subtract(7, 'day').startOf('day');
        //   this._dateRangeEnd = moment().local().endOf('day');
        //   break;
        // case 'Last 30 Days':
        //   this._dateRangeStart = moment().local().subtract(30, 'day').startOf('day');
        //   this._dateRangeEnd = moment().local().endOf('day');
        //   break;
        case 'Custom':
          this._dateRangeStart = moment().local().subtract(1, 'day').startOf('day').toDate();
          this._dateRangeEnd = moment().local().endOf('day').toDate();
          break;
      }

      setTimeout(this.setFilter);
    };
  }

  selectChange = (name) => {
    return (selected) => {
      if (Object.prototype.hasOwnProperty.call(selected, 'value')) {
        this['_' + name] = selected.value;
      } else if (selected) {
        this['_' + name] = selected;
      } else {
        this['_' + name] = [];
      }
      setTimeout(this.setFilter);
    };
  }

  dateChange = (name) => {
    return (value) => {
      this['_' + name] = value;

      if (this._dateRangeStart && this._dateRangeEnd) {
        setTimeout(this.setFilter);
      }
    };
  }

  setFilter = (e) => {
    console.log(e.target, this._alarmRef.current.checked);
    const filters = { ...this.props.travelersFilter };
    if (this._vipRef !== undefined && this._vipRef.current !== undefined) {
      if (!Object.prototype.hasOwnProperty.call(this.props, 'hideStatusFilter')) {
        filters.status = {
          alarm: this._alarmRef.current.checked,
          warning: this._warningRef.current.checked,
          ok: this._okRef.current.checked
        };
      }

      // filters.vip = this._vipRef.current.checked;
      // filters.nonHelped = this._nonHelpedRef.current.checked;
    }

    filters.dateRangeType = this._dateRangeType;

    if (filters.dateRangeType !== 'Current' && this._dateRangeStart) {
      if (this._dateRangeStart instanceof Date) {
        filters.dateRangeStart = this._dateRangeStart.toISOString().split('T')[0];
      } else {
        filters.dateRangeStart = this._dateRangeStart.format('YYYY-MM-DD');
      }
    } else {
      filters.dateRangeStart = null;
    }
    if (filters.dateRangeType !== 'Current' && this._dateRangeEnd) {
      if (this._dateRangeEnd instanceof Date) {
        filters.dateRangeEnd = this._dateRangeEnd.toISOString().split('T')[0];
      } else {
        filters.dateRangeEnd = this._dateRangeEnd.format('YYYY-MM-DD');
      }
    } else {
      filters.dateRangeEnd = null;
    }
    if (filters.company) {
      filters.company = this._company;
    }
    if (filters.carrier) {
      filters.carrier = this._carrier;
    }
    if (filters.airport) {
      filters.airport = this._airport;
    }
    if (filters.fstatus) {
      filters.fstatus = this._fstatus;
    }
    if (filters.costcenter_id) {
      filters.costcenter_id = this._costcenter_id;
    }
    this.props.setTravelersFilter(filters);
  };

  render () {
    const { l, ngettext } = this.context.i18n;
    const {
      travelers, filteredTravelers, companyList,
      carrierList, airportList, travelersFilter, userRole,
      hideStatusFilter, title
    } = this.props;
    const { dateRangeType, company, carrier, airport, status } = travelersFilter;
    // const costcenterId = travelersFilter.costcenter_id;

    const dateRangeTypeOptions = this._dateRangeTypeOptions.map((i) => { return { value: i, label: l(i) }; });

    // let costcenterSelect = null;
    // if (isCompanyAdminOrUser(userRole) && costCenterList && costCenterList.length && costcenterId) {
    // if (!find(costCenterList, { 'value': 'all' })) {
    //   costCenterList.unshift({value: 'all', label: l('All Sort level ID')});
    // }
    //   costcenterSelect = (
    //     <Select
    //       value={costcenterId}
    //       options={costCenterList}
    //       searchable
    //       multi
    //       simpleValue
    //       clearable
    //       placeholder={l('All Sort level ID')}
    //       optionRenderer={({ label }) => (<label>{label}</label>)}
    //       onChange={this.selectChange('costcenter_id')} />
    //   );
    // }

    let companySelect = null;
    if (!isCompanyAdminOrUser(userRole) && companyList && company) {
      // if (!find(companyList, { 'value': 'all' })) {
      //   companyList.unshift({value: 'all', label: l('All Companies')});
      // }

      companySelect = (
        <Select
          value={company}
          options={companyList}
          searchable
          multi
          simpleValue
          clearable
          className='company-select'
          optionRenderer={({ label }) => (<label>{label}</label>)}
          placeholder={l('All Companies')}
          onChange={this.selectChange('company')} />
      );
    }

    let carrierSelect = null;
    if (carrierList && carrier) {
      const carrierSortedList = sortBy(carrierList, 'label');
      // if (!find(carrierSortedList, { 'value': 'all' })) {
      //   carrierSortedList.unshift({value: 'all', label: l('All Carriers')});
      // }

      carrierSelect = (
        <Select
          value={carrier}
          options={carrierSortedList}
          searchable
          multi
          simpleValue
          clearable
          placeholder={l('All Carriers')}
          optionRenderer={({ label }) => (<label>{label}</label>)}
          onChange={this.selectChange('carrier')} />
      );
    }
    let airportSelect = null;
    if (airportList && airport) {
      const airportSortedList = sortBy(airportList, 'label');
      // if (!find(airportSortedList, { 'value': 'all' })) {
      //   airportSortedList.unshift({value: 'all', label: l('All Airports')});
      // }

      airportSelect = (
        <Select
          clearable
          value={airport}
          options={airportSortedList}
          searchable
          multi
          simpleValue
          placeholder={l('All Airports')}
          optionRenderer={({ label }) => (<label>{label}</label>)}
          onChange={this.selectChange('airport')} />
      );
    }

    // let flightStatusSelect = null;
    // if (flightStatusList && fstatus) {
    //   flightStatusSelect = (
    //     <Select
    //       clearable
    //       value={fstatus}
    //       options={flightStatusList}
    //       multi
    //       simpleValue
    //       placeholder={l('All Flight Statuses')}
    //       optionRenderer={({ label }) => (<label>{label}</label>)}
    //       onChange={this.selectChange('fstatus')} />
    //   );
    // }

    let info;
    if (travelers && filteredTravelers) {
      let trLength = filteredTravelers;
      let totalLength = travelers;
      if (typeof travelers === 'object') {
        trLength = filter(filteredTravelers, { status: 'active' }).length;
      }
      if (typeof travelers === 'object') {
        if (!$('#map-flights').hasClass('active')) {
          totalLength = filter(travelers, { status: 'active' }).length;
        } else {
          totalLength = sessionStorage.get('TravelerCount');
          // totalLength = filter(travelers, function (traveler) {
          //  return (traveler.status === 'active' &&
          //    (traveler.currentJourneyStatus === 'warning' || traveler.currentJourneyStatus === 'alarm'));
          // }).length;
        }
      }
      if (title === 'flight') {
        const text = sprintf(ngettext(
          `%d flight of ${totalLength}`,
          `%d flights of ${totalLength}`,
          trLength
        ), trLength);
        info = totalLength ? text : null;
      } else {
        const text = sprintf(ngettext(
          `%d traveler of ${totalLength}`,
          `%d travelers of ${totalLength}`,
          trLength
        ), trLength);
        info = totalLength ? text : null;
      }
    }

    const showStatusFilter = !hideStatusFilter;

    return (
      <>
      <div className='travele'>
       <div className='travele-info'>
      <h1>{l('FlightBoard')}</h1>
      <span className='info'>{info}</span>
      </div>
      <div className='filter-travelers'>
          <CollapseHolder saveState='activeTravelersFilter' opener='opener'>
            <CollapseOpener>
              <div className='filter-head'>
                <div>
                  {/* <img src={Leaf} alt="" className='opener' /> */}
                  {/* <DownlaodIcon style={{ color: 'white', backgroundColor: 'blue' }} className='opener'/> */}
                {/* <h3 className='opener'>{l('Filters')} <span className='arrow' /></h3> */}
                  {/* <span className='info'>{info}</span> */}
                </div>
              </div>
        </CollapseOpener>
        <CollapseBlock>

        </CollapseBlock>
        </CollapseHolder>
        <CollapseHolder saveState='activeTravelersFilter' opener='opener'>
          <CollapseOpener>
            <div className='filter-head'>
              <div>
                <img src={FiltersActive} alt='' className='opener' />
                {/* <TfilterIcon style={{ color: 'white', backgroundColor: 'blue' }} className='opener'/> */}
                {/* <h3 className='opener'>{l('Filters')} <span className='arrow' /></h3> */}
              </div>

              {/* {flightStatusList != null && (
                <div className='filter-daterange-container'>
                  <div className='filter-daterangetype'>
                    <b>{l('Date Range:')}</b>
                    <div className='filter-dateranges-container'>
                      <Select clearable={false} value={dateRangeType} options={dateRangeTypeOptions}
                        onChange={this.dateRangeChange(this)} />
                      {dateRangeType === 'Custom' && (
                        <div className='filter-dateranges'>
                          <DatePicker id='dateRangeStart' name='dateRangeStart' autoComplete='off'
                            className='filter-daterange'
                            selected={this._dateRangeStart} maxDate={this._dateRangeEnd}
                            onChange={this.dateChange('dateRangeStart')} />

                          <label>-</label>

                          <DatePicker id='dateRangeEnd' name='dateRangeEnd' autoComplete='off'
                            className='filter-daterange'
                            selected={this._dateRangeEnd} minDate={this._dateRangeStart}
                            onChange={this.dateChange('dateRangeEnd')} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )} */}
              {/* <div className='filter-export-wrap'>
                <a className='clear-all' href='/' onClick={this.clear} >{l('Clear Filters')}</a>
                {this.props.exportToFile && (
                  <button className='export-xlsx' onClick={this.exportToExcel} />
                )}
                {this.props.exportToFile && (
                  <button className='export-pdf' onClick={this.exportToPdf} />
                )}
              </div> */}
            </div>
          </CollapseOpener>
          <CollapseBlock>
            <div className='holder-wrap'>
              {!showStatusFilter
                ? <>
                <div className='holder'>
                  <div style={{ display: 'flex', paddingLeft: '21px' }} >
                  <img src={Filter} alt='' className='opener' />
                  <a className='clear' href='/' onClick={this.clear} >{l('Clear Filters')}</a>
                  <img src={HamburgerIcon} alt="" width='16px' height='14.4px' style={{ paddingLeft: '60px' }} />
                  {/* <i className="fa fa-align-justify" style={{ paddingLeft: '60px', opacity: '0.2' }}></i> */}
                  </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }}>Date Range :</p>
                <div className='filter-dateranges-container'>
                      <div clearable='false' value={dateRangeType} options={dateRangeTypeOptions}
                        onChange={this.dateRangeChange(this)} />
                        <div className='filter-dateranges'>
                          <DatePicker id='dateRangeStart' name='dateRangeStart' autoComplete='off'
                            className='filter-daterange'
                            selected={this._dateRangeStart} maxDate={this._dateRangeEnd}
                            onChange={this.dateChange('dateRangeStart')} />
                          <label>-</label>
                          <DatePicker id='dateRangeEnd' name='dateRangeEnd' autoComplete='off'
                            className='filter-daterange'
                            selected={this._dateRangeEnd} minDate={this._dateRangeStart}
                            onChange={this.dateChange('dateRangeEnd')} />
                        </div>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }}>Disruption Status:</p>
                  <ul className='status-cb'>
                    <li>
                      <input id='st01' checked={status && status.alarm}
                        type='checkbox' ref={this._alarmRef} onChange={this.setFilter} />
                      <label htmlFor='st01'><i className='icon alarm'>alarm</i></label>
                    </li>
                    <li>
                      <input id='st02' checked={status && status.warning}
                        type='checkbox' ref={this._warningRef} onChange={this.setFilter} />
                      <label htmlFor='st02'><i className='icon warning'>{l('warning')}</i></label>
                    </li>
                    <li>
                      <input id='st03' checked={status && status.ok}
                        type='checkbox' ref={this._okRef} onChange={this.setFilter} />
                      <label htmlFor='st03'><i className='icon ok'>{l('ok')}</i></label>
                    </li>
                  </ul>
                </div>
              <div className='select-holder'>
              <>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }}>Additional Filters:</p>
              </>
              <div className= 'additional'>
                {/* {flightStatusSelect} */}
                <div style={{ width: '200px', height: '27px' }}>{companySelect}</div>
                {/* {costcenterSelect} */}
                <div>{carrierSelect}</div>
                 <div>{airportSelect}</div>
              </div>
              </div>
              </>
                : ''
              }
              {/* <div className='cust-holder'>
                <div className='cust-cb'>
                  <input id='need' checked={nonHelped}
                    type='checkbox' ref={this._nonHelpedRef} name='nonHelped' onChange={this.setFilter} />
                  <label htmlFor='need'>{l('Needs Assistance')}</label>
                </div>
                <div className='cust-cb'>
                  <input id='vip' checked={vip} type='checkbox' ref={this._vipRef} name='vip'
                    onChange={this.setFilter} />
                  <label htmlFor='vip'>{l('VIP Only')}</label>
                </div>
              </div> */}
            </div>
          </CollapseBlock>
        </CollapseHolder>
          <CollapseHolder saveState='activeTravelersFilter' opener='opener'>
            <CollapseOpener>
              <div className='filter-head'>
                <div>
                  <img src={Download} alt="" className='opener' />
                  {/* <DownlaodIcon style={{ color: 'white', backgroundColor: 'blue' }} className='opener'/> */}
                {/* <h3 className='opener'>{l('Filters')} <span className='arrow' /></h3> */}
                  {/* <span className='info'>{info}</span> */}
                </div>
              </div>
        </CollapseOpener>
        <CollapseBlock>
        <div className='exportspx'>
          <div>
            <img src={HamburgerIcon} alt="" style={{ paddingLeft: '258px' }}/>
        {/* <img className="fa fa-align-justify" style={{ paddingLeft: '278px', opacity: '0.2' }}></img> */}
        </div>
            {/* <a className='clear-all' href='/' onClick={this.clear} >{l('Clear Filters')}</a> */}
                <div className='exports' style={{ width: '203px', height: '100px' }}>
                {this.props.exportToFile && (
                  // <button className='export-xlsx' onClick={this.exportToExcel} />
                  <div style= {{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  <img src={XLS} className='export-xlsx'onClick={this.exportToExcel} />
                  <p>XLS</p>
                  </div>
                )}
                {this.props.exportToFile && (
                  // <button className='export-pdf' onClick={this.exportToPdf} />
                  <div style= {{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                  <img className='export-pdf' src={PDF} onClick={this.exportToPdf} alt =''/>
                  <p>PDF</p>
                  </div>
                )}
                </div>
        </div>
        </CollapseBlock>
        </CollapseHolder>
      </div>
      </div>
      </>
    );
  }
}
export default TravelersFilter;
