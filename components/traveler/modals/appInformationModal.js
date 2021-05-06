import PropTypes from 'prop-types';
import React from 'react';
import Modal from '../../../containers/Common/Modal';

export default class AppInformationModal extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    settings: PropTypes.any
  };

  constructor () {
    super(...arguments);
    this._appInfoRef = React.createRef();
    this.state = {
      activeTab: 'appNotification'
    };
  }

  showModal = () => {
    if (this._appInfoRef && this._appInfoRef.current) {
      this._appInfoRef.current.openModal();
    }
  }

  switchTabTo = (tabName) => (e) => {
    e.preventDefault();
    this.setState({
      activeTab: tabName
    });
  }

  isActive = (tabName) => {
    return tabName === this.state.activeTab ? 'active' : '';
  }

  render () {
    const { l } = this.context.i18n;
    const { settings } = this.props;
    const { activeTab } = this.state;

    if (!settings) return null;

    let settingsInfo;
    if (settings) {
      settingsInfo = (
        <table>
          <thead>
            <tr>
              <th />
              <th>{l('Email')}</th>
              <th>{l('SMS')}</th>
              <th>{l('Push')}</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((notif) => (
              <tr key={notif.type}>
                <td>{notif.type}</td>
                <td>{notif.email ? (<span className='on'>On</span>) : (<span className='off'>Off</span>)}</td>
                <td>{notif.sms ? (<span className='on'>On</span>) : (<span className='off'>Off</span>)}</td>
                <td>{notif.push ? (<span className='on'>On</span>) : (<span className='off'>Off</span>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    let tab = (
      <div className='no-events'>
        <span>{l('Feature functionality')}</span>
      </div>
    );
    if (activeTab === 'appNotification') {
      tab = (
        <div>
          {settingsInfo}
        </div>
      );
    }

    return (
      <Modal ref={this._appInfoRef}>
        <div className='modal-head'>
          <ul className='tabset'>
            <li>
              <a href='' className={this.isActive('appUsage')} onClick={this.switchTabTo('appUsage')}>
                {l('App Usage')}
              </a>
            </li>
            <li>
              <a href='' className={this.isActive('appNotification')} onClick={this.switchTabTo('appNotification')}>
                {l('App Notifications')}
              </a>
            </li>
          </ul>
        </div>
        <div className='modal-scroll'>
          {tab}
        </div>
      </Modal>
    );
  }
}
