/* eslint-disable max-len */
import PropTypes from 'prop-types';
import React from 'react';
import Select from '../../components/common/select/Select';
// import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import { isCompanyAdminOrUser } from '../../helpers/user';
import DropdownMenu from 'react-dd-menu';
import { NavLink } from 'react-router-dom';
import 'react-dd-menu/dist/react-dd-menu.css';
import Main from './datePicker';
// import Menu from '@material-ui/core/Menu';
// import MenuItem from '@material-ui/core/MenuItem';

export class TravelersFilter extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
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
    menuOptions: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    this._warningRef = React.createRef();
    this._alarmRef = React.createRef();
    this._okRef = React.createRef();
    this._vipRef = React.createRef();
    // this._nonHelpedRef = React.createRef();
    this._selectDefault = [];
    this._company = this.props.travelersFilter.company;
    this._carrier = this.props.travelersFilter.carrier;
    this._airport = this.props.travelersFilter.airport;
    this._fstatus = this.props.travelersFilter.fstatus;
    this._costcenter_id = this.props.travelersFilter.costcenter_id;
    this.setFilter = this.setFilter.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      open: false,
      value: 'Disruption status',
      continent: 'All Continents'

    };
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

  handleButtonClick = () => {
    this.setState(state => {
      return {
        open: !state.open
      };
    });
  };

  handleChange (event) {
    this.setState({ continent: event.target.value });
    console.log(event.target.value);
  }

  handleSubmit (event) {
    event.preventDefault();
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

  setFilter = (e) => {
    console.log(e.target, this._alarmRef.current.checked);
    // this.setState({ value: e.target.value });
    const filters = { ...this.props.travelersFilter };
    if (!Object.prototype.hasOwnProperty.call(this.props, 'hideStatusFilter')) {
      filters.status = {
        alarm: this._alarmRef.current.checked,
        warning: this._warningRef.current.checked,
        ok: this._okRef.current.checked
      };
    }
    filters.vip = this._vipRef.current ? this._vipRef.current.checked : null;
    // filters.nonHelped = this._nonHelpedRef.current ? this._nonHelpedRef.current.checked : null;
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
    console.log(filters, 'anything');
    this.props.setTravelersFilter(filters);
  };

  render () {
    const { l } = this.context.i18n;
    const {
      companyList, costCenterList,
      carrierList, airportList, flightStatusList, travelersFilter, userRole,
      hideStatusFilter, menuOptions
    } = this.props;
    const { company, carrier, airport, fstatus, status } = travelersFilter;
    // console.log(status, 'insiderender');
    // const { vip, nonHelped, company, carrier, airport, fstatus, status } = travelersFilter;
    const costcenterId = travelersFilter.costcenter_id;

    let costcenterSelect = null;
    if (isCompanyAdminOrUser(userRole) && costCenterList && costCenterList.length && costcenterId) {
      // if (!find(costCenterList, { 'value': 'all' })) {
      //   costCenterList.unshift({value: 'all', label: l('All Sort level ID')});
      // }

      costcenterSelect = (
        <Select
          value={costcenterId}
          options={costCenterList}
          searchable
          multi
          simpleValue
          clearable
          placeholder={l('All Sort level ID')}
          optionRenderer={({ label }) => (<label>{label}</label>)}
          onChange={this.selectChange('costcenter_id')} />
      );
    }

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

    let flightStatusSelect = null;
    if (flightStatusList && fstatus) {
      flightStatusSelect = (
        <Select
          clearable
          value={fstatus}
          options={flightStatusList}
          multi
          simpleValue
          placeholder={l('All Flight Statuses')}
          optionRenderer={({ label }) => (<label>{label}</label>)}
          onChange={this.selectChange('fstatus')} />
      );
    }
    // let {travelersFilter} = this.props.travelersFilte
    const statusCheckboxes = !hideStatusFilter
      ? (
    <div className='travelers-filter__dropdown'>
      {this.state.open && (
      <ul className='travelers-filter__dropdown-status-selector'>
        <li>
          <input id='st01' checked={status && status.alarm}
            type='checkbox' ref={this._alarmRef} onChange={(e) => {
              this.setFilter(e);
            }} />
          <label htmlFor='st01'><i className='icon alarm'>{l('alarm')}</i> Red</label>
        </li>
        <li>
          <input id='st02' checked={status && status.warning}
            type='checkbox' ref={this._warningRef} onChange={(e) => { this.setFilter(e); }} />
          <label htmlFor='st02'><i className='icon warning'>{l('warning')}</i> Yellow</label>
        </li>
        <li>
          <input id='st03' checked={status && status.ok}
            type='checkbox' ref={this._okRef} onChange={(e) => { this.setFilter(e); }}/>
          <label htmlFor='st03'><i className='icon ok'>{l('ok')}</i> Green</label>
        </li>
      </ul>
      )}
    </div>)
      : null;

    return (
      <>
      <DropdownMenu {...menuOptions} className='travelers-filter__dropdown'>
        <header className='travelers-filter__dropdown-header'>
          <div className='travelers-filter__dropdown-title-cnt'>
            <h3 className='travelers-filter__dropdown-title'>{l('Filter Travelers')}</h3>
            <NavLink to='/settings/global-filter' activeClassName='active'>
              <i className='icon-global-settings' />
            </NavLink>
          </div>
          <button className='travelers-filter__close-btn' onClick={menuOptions.close}>
            <i className='icon-cross' />
          </button>
        </header>
        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Date Range :</p>
        <Main/>
        <div className='travelers-filter__dropdown-body'>
          <div className='status' onClick={this.handleButtonClick} >
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Disruption status:</p>
            <select onSubmit={this.handleSubmit} style={{ width: '170px', marginLeft: '11px' }} className='travelers-filter__dropdown-option-holder' >
              {/* <option style={{ width: '200px' }} value={ statusCheckboxes }>{ statusCheckboxes }</option> */}
            </select>
          <div className='travelers-filter__dropdown-option-holder'>
            { statusCheckboxes }
          </div>
          </div>

          <hr />
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Locations: </p>

          <div style={{ width: '200px' }} className='travelers-filter__dropdown-option-holder'>
            {flightStatusSelect}
            {companySelect}
            {costcenterSelect}
            {carrierSelect}
            {airportSelect}
          </div>
          <select style={{ width: '170px', marginLeft: '11px' }} className='travelers-filter__dropdown-option-holder' value={this.state.contnient} onChange={this.handleChange}>
            <option name="N.America">N.America</option>
            <option name="S.America">S.America</option>
            <option name="Europe">Europe</option>
            <option name="Asia">Asia</option>
            <option name="Oceania">Oceania</option>
            <option name="Africa">Africa</option>
          </select>
            {/* <div >
            {flightStatusSelect}
            {companySelect}
            {costcenterSelect}
            {carrierSelect}
            {airportSelect}
          </div> */}
           <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Additional Filters: </p>

          <div style={{ width: '200px' }} className='travelers-filter__dropdown-option-holder'>
            {flightStatusSelect}
            {companySelect}
            {costcenterSelect}
            {carrierSelect}
            {airportSelect}
          </div>
          <p className='travelers-filter__dropdown-title'>{l('Layers')}</p>
          <hr/>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Health: </p>
          <Select></Select>
          <hr/>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Security: </p>
          <Select></Select>
          <hr/>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#154591' }} className='travelers-filter__dropdown-option-title'>Points of Interest: </p>
          <Select></Select>

          {/* <ul className='travelers-filter__dropdown-status-selector'>
            <li>
              <input id='need' checked={nonHelped} type='checkbox'
                ref={this._nonHelpedRef} name='nonHelped' onChange={this.setFilter} />
              <label htmlFor='need'>{l('Needs Assistance')}</label>
            </li>
            <li>
              <input id='vip' checked={vip} type='checkbox'
                ref={this._vipRef} name='vip' onChange={this.setFilter} />
              <label htmlFor='vip'>{l('VIP Only')}</label>
            </li>
          </ul> */}
        </div>

        <footer className='travelers-filter__dropdown-footer'>
          <a className='clear-all' href='/' onClick={this.clear} >{l('Clear Filters')}</a>
        </footer>
      </DropdownMenu>
      </>
    );
  }
}
export default TravelersFilter;
