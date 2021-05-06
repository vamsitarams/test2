export default () => {
  const nav = window.navigator;
  return (nav.appName + nav.appCodeName + nav.platform).replace(' ', '');
};
