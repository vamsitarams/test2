import PropTypes from 'prop-types';
import React from 'react';

export default ({ selectedLanguage, locales, languages, onSelect }) => {
  propTypes = {
    selectedLanguage: PropTypes.any,
    locales: PropTypes.any,
    languages: PropTypes.any,
    onSelect: PropTypes.any
  };

  return (
    <div>
      <select
        defaultValue={selectedLanguage}
        onChange={(e) => onSelect(e.target.value)}>
        {
          locales.map(lang =>
            <option key={lang} value={lang} className='LanguageSwitch__option'>
              {languages[lang].toUpperCase()}
            </option>
          )
        }
      </select>
    </div>
  );
};
