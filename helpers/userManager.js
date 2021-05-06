export function getBackLink (pathname, str) {
  const index = pathname.indexOf(str);
  return index !== -1 ? pathname.slice(0, index) : pathname;
}
