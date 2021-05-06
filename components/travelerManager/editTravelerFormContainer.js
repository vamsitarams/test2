import PropTypes from 'prop-types';
import React from 'react';
import { localStorage, sessionStorage } from '../../helpers/localStorage';
import { Link } from 'react-router-dom';
import { isGlobalAdmin } from '../../helpers/user';
import TravelerForm from './travelerForm';
// import BlockTraveler from '../../containers/TravelerManager/BlockTraveler';
import SendInvitation from '../../containers/TravelerManager/SendInvitationsBlock';

export class EditTravelerFormContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    traveler: PropTypes.object.isRequired,
    companiesList: PropTypes.array.isRequired,
    sortLevelIds: PropTypes.array.isRequired,
    errorMessage: PropTypes.string.isRequired,
    loading: PropTypes.bool.isRequired,
    travelerLoading: PropTypes.bool.isRequired,
    sendInvitationLoading: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool,
    appSettingsDimensions: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    saveTraveler: PropTypes.func.isRequired,
    loadCompanies: PropTypes.func.isRequired,
    loadTraveler: PropTypes.func.isRequired,
    cancelForm: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
  };

  constructor (props) {
    super(props);
    this.state = {
      prevLink: ''
    };
  }

  UNSAFE_componentWillMount () {
    let pagePrev = sessionStorage.get('editPrevLocation');
    if (!pagePrev) {
      const localStoragePrev = localStorage.get('editPrevLocation') || '/travelers-list';
      sessionStorage.set('editPrevLocation', localStoragePrev);
      pagePrev = localStoragePrev;
    }
    this.setState({ prevLink: pagePrev });
  }

  get breadCrumbsLink () {
    const { l } = this.context.i18n;
    const prevPageTitle = (this.state.prevLink === '/travelers-list') ? l('Travelers Details') : l('Travelers Details');
    return (<Link to={this.state.prevLink}>{prevPageTitle}</Link>);
  }

  componentWillUnmount () {
    sessionStorage.remove('editPrevLocation');
    this.props.resetForm();
  }

  render () {
    const { l } = this.context.i18n;
    let blockIcon;
    let resendDisabled = false;
    if (this.props.traveler && this.props.traveler.status === 'blocked') {
      blockIcon = (<span className='glyphicon glyphicon-lock' />);
    }
    if (this.props.traveler && this.props.traveler.isGeneratedEmail) {
      resendDisabled = true;
    }

    return (
        <div className='min-container'>
          <div className='head-row'>
            <ul className='breadcrumb users-breadcrumb'>
              <li>{this.breadCrumbsLink}</li>
              <li>{blockIcon}{this.props.traveler.firstName} {this.props.traveler.lastName}</li>
            </ul>
          </div>
          <div className='holder'>
            <div className='side-block'>
              <TravelerForm {...this.props} cancelBtnLink={this.state.prevLink} />
            </div>
            <div className='additional-section'>
              <ul className='options-list'>
                <li>
                  {/* Commented out to remove from Travelers Details Page */}
                  {/* <BlockTraveler
                    travelerId={this.props.traveler._id.$oid}
                    travelerStatus={this.props.traveler.status} /> */}
                </li>
                {isGlobalAdmin(this.props.user.roleName) &&
                  <li>
                    <SendInvitation
                      text={l('Resend Invitation')}
                      travelerId={this.props.traveler._id.$oid}
                      loading={this.props.sendInvitationLoading}
                      resendDisabled={resendDisabled} />
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
    );
  }
}
export default EditTravelerFormContainer;
