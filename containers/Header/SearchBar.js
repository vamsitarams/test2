import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import { actions as searchActions, stateSearch } from '../../redux/modules/search';

import Search from '../../components/common/search';

const mapStateToProps = createSelector(
  stateSearch,
  (stateSearch) => {
    return {
      search: stateSearch
    };
  }
);

const mapDispatchToProps = (dispatch) => {
  return {
    ...bindActionCreators(searchActions, dispatch)
  };
};

export class SearchBarContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object,
    router: PropTypes.object
  };

  static propTypes = {
    search: PropTypes.shape({
      searchText: PropTypes.string,
      searchResults: PropTypes.array,
      loading: PropTypes.bool
    }).isRequired,
    searchTraveler: PropTypes.func.isRequired,
    cleanSearch: PropTypes.func.isRequired,
    history: PropTypes.object
  };

  constructor (props) {
    super(props);
    this._searchRef = React.createRef();
  }

  selectResult = (id) => (e) => {
    e.preventDefault();
    this._searchRef.current.remove();
    this.props.history.push('/traveler/' + id);
  }

  prepareResultItem = (traveler) => {
    const firstName = this._searchRef.current.highlight(traveler.firstName, 'firstName');
    const lastName = this._searchRef.current.highlight(traveler.lastName, 'lastName');
    const organization = this._searchRef.current.highlight(traveler.organization.name, 'organization');
    const userName = this._searchRef.current.highlight(traveler.userName, 'userName');
    return (
      <a href='' key={traveler._id.$oid} onClick={this.selectResult(traveler._id.$oid)}>
        <strong>{firstName} {lastName}</strong>
        <p>{organization}, {userName}</p>
      </a>
    );
  }

  render () {
    const { l } = this.context.i18n;
    return (
      <Search
        className='small-grey'
        ref={this._searchRef}
        placeholder={l('Search')}
        searchText={this.props.search.searchText}
        searchResults={this.props.search.searchResults}
        loading={this.props.search.loading}
        cleanSearch={this.props.cleanSearch}
        sendSearchQuery={this.props.searchTraveler}
        prepareResultItem={this.prepareResultItem} />
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchBarContainer));
