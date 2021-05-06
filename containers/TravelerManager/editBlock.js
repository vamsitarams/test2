import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { localStorage } from '../../helpers/localStorage';

export default class EditBlock extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  static propTypes = {
    travelerId: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired
  }

  onClick = () => {
    localStorage.set('editPrevLocation', this.props.location.pathname);
  }

  render () {
    const { l } = this.context.i18n;
    return (
      <Link to={`/traveler/${this.props.travelerId}/edit`} className='btn btn-default btn-edit' onClick={this.onClick}>
        {l('Edit')}
      </Link>
    );
  }
}
