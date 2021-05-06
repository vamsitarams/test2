import base64 from './components/enc-base64';
import hmac from './components/hmac';

const CryptoJS = {
  ...base64,
  ...hmac
};

export default CryptoJS;
