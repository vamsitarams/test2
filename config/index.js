import _dev from './_development';
import _prod from './_production';
import _stg from './_staging';

let config = _prod;

if (__DEV__) {
  config = _dev;
} else if (process.env.NODE_ENV === 'staging') {
  config = _stg;
}

export default config;
