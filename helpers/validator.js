/* eslint max-len: [2, 300, 2] */ // maximum length of 300 characters
import isEmpty from 'lodash/isEmpty';

class Validator {
  constructor () {
    this.emailRegExp = /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,7}$/;
    this.phoneRegExp = /^[\d\(\)\+\-\s]+$/;
  }

  isValidEmail (email) {
    return this.emailRegExp.test(email);
  }

  isEmpty (val) {
    return !!val;
  }

  isValidPhone (phone) {
    return this.phoneRegExp.test(phone);
  }

  isValidMaxLength (val, length = 255) {
    return val.length <= length;
  }

  isNotEmpty (val) {
    return (!isEmpty(val));
    /*
    return (
      (typeof val === 'string' && val.trim().length > 0)
    )
    */
  }
}
export default new Validator();
