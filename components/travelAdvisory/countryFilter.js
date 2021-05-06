import PropTypes from 'prop-types';
import React from 'react';

class CountryFilter extends React.Component {
  static propTypes = {
    changeFilter: PropTypes.func.isRequired
  };

  clearSearchField = () => {
    this.searchInput.value = '';
    this.props.changeFilter('');
  };

  render () {
    return (
      <div className='search-block'>
        <input
          type='text'
          name='search'
          onChange={this.props.changeFilter}
          ref={input => {
            this.searchInput = input;
          }}
        />
        <button className='btn-clear' onClick={this.clearSearchField}>
          Clear
        </button>
      </div>
    );
  }
}

export default CountryFilter;
