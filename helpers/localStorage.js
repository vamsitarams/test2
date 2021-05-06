const ls = window.localStorage;
const ss = window.sessionStorage;

export const localStorage = {
  set: function (key, value) {
    if (key && value !== undefined) {
      ls[key] = JSON.stringify(value);
    }
  },
  get: function (key) {
    const value = ls[key];
    if (value !== undefined) {
      return JSON.parse(value);
    }
  },
  remove: function (key) {
    if (Object.prototype.hasOwnProperty.call(ls, key)) {
      delete ls[key];
    }
  },
  empty: function () {
    ls.clear();
  }
};

export const sessionStorage = {
  set: function (key, value) {
    if (key && value !== undefined) {
      ss[key] = JSON.stringify(value);
    }
  },
  get: function (key) {
    const value = ss[key];
    if (value !== undefined) {
      return JSON.parse(value);
    }
  },
  remove: function (key) {
    if (Object.prototype.hasOwnProperty.call(ss, key)) {
      delete ss[key];
    }
  },
  empty: function () {
    ss.clear();
  }
};
