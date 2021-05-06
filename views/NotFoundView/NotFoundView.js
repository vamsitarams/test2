import PropTypes from 'prop-types';
import React from 'react';

export default class NotFoundView extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  render () {
    const { l } = this.context.i18n;
    return (
      <div className='error-page'>
        <div className='error-wrap'>
          <a href='/' className='logo'>{l('Dashboard')}</a>
          <div className='error-text'>
            <h1>{l('404')}</h1>
            <h2>{l('Page Not Found')}</h2>
            <a href='/' className='btn btn01'>{l('Go to Dashboard')}</a>
          </div>
        </div>
      </div>
    );
  }
}
