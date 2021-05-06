export function sortProperties (obj, property, alphabetical = 1, isNumericSort = false) {
  const sortable = obj;
  if (Object.prototype.hasOwnProperty.call(obj[0], property)) {
    if (isNumericSort) {
      sortable.sort(function (a, b) {
        return a[property] - b[property] * alphabetical;
      });
    } else {
      sortable.sort((a, b) => {
        const x = a[property].toLowerCase();
        const y = b[property].toLowerCase();
        return (x < y ? -1 : x > y ? 1 : 0) * alphabetical;
      });
    }
  }
  return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}
