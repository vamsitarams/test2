import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

function AdvisoryBox (props) {
  const { country } = props;
  const levelText = country.levelText.replace(':', ' -');
  const updateDate = moment(country.updated).format('MMMM DD, YYYY');

  return (
    <div className='advisory-box'>
      <div className='mainbox'>
        <div className='head'>
          <h3>{country.title}</h3>
          <div className={'level level-' + country.level}>
            <em>Level {levelText}</em>
            <ul>
            {
              country.threads && country.threads.map(thr => (
                <li key={thr.ico}>
                  {thr.ico + ' '}
                  <span
                    className='tooltip tooltip-bottom'
                    dangerouslySetInnerHTML={{ __html: thr.text.replace(/([\w\s]+:)/, '<strong>$1</strong>') }} />
                </li>
              ))
            }
            </ul>
          </div>
          <p>Last update {updateDate}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: country.alertText }} />
      </div>
      <div className='sidebox-holder'>
        <div className='go-to-site'>
          <a href='https://travel.state.gov' target='_black'>
            Go to travel.state.gov <i className='fas fa-external-link-alt' />
          </a>
        </div>
        <div className='sidebox'>
          <div dangerouslySetInnerHTML={{ __html: country.notificationsHTML }} />
        </div>
      </div>
    </div>
  );
}

AdvisoryBox.propTypes = {
  country: PropTypes.object
};

export default AdvisoryBox;
