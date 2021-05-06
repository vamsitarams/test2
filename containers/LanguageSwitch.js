import PropTypes from 'prop-types';
import React from 'react';
import cookie from 'cookie';

import { getSupportedLocales, getSupportedLanguages } from '../i18n/utils';

import LanguageSwitch from '../components/common/languageSwitch';

const SUPPORTED_LOCALES = getSupportedLocales();
const SUPPORTED_LANGUAGES = getSupportedLanguages();

export default class LanguageSwitchContainer extends React.Component {
  static contextTypes = {
    i18n: PropTypes.object
  };

  handleSelectLanguage = (newLocale) => {
    document.cookie = cookie.serialize('locale', newLocale, { path: '/', maxAge: 900000 });
    window.location.reload();
  };

  render () {
    const { getLocale } = this.context.i18n;

    return (
      <LanguageSwitch
        languages={SUPPORTED_LANGUAGES}
        locales={SUPPORTED_LOCALES}
        selectedLanguage={getLocale()}
        onSelect={this.handleSelectLanguage}
      />
    );
  }
}
