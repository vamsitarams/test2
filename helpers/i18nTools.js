import i18n from '../i18n';
import cookie from 'cookie';
import config from '../config';
import { localStorage } from '../helpers/localStorage';
const locale = cookie.parse(document.cookie).locale || config.locale.defaultLocale;

const localeData = localStorage.get('localeData');
let i18nTools = new i18n.Tools({ localeData: { domain: 'messages' }, locale: locale });
if (localeData) {
  i18nTools = new i18n.Tools({
    localeData: localStorage.get('localeData'),
    locale: locale
  });
}
export default i18nTools;
