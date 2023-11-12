export default {
  isVoid (value) {
    return [undefined, null].includes(value);
  },

  isScalar (value) {
    return !['object', 'function', 'symbol'].includes(typeof value);
  },

  isObject (value) {
    return (typeof value === 'object');
  },

  equalsAsStrAndNotEmpty (first, second) {
    if (!first) { return false; }
    if (!second) { return false; }
    if ((!this.isScalar(first)) || (!this.isScalar(second))) { return false; }
    return (first + '') === (second + '');
  },
};
