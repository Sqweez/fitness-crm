export default {
  filter (input, callback) {
    if (!input) { return {}; }

    const result = {};
    for (const key in input) {
      const value = input[key];
      if (callback(value, key)) {
        result[key] = value;
      }
    }
    return result;
  },

  first (input, callback = undefined, fallback = undefined) {
    if ((!input) || (input.length === 0)) { return fallback; }

    if (!callback) {
      for (const key in input) {
        return input[key];
      }
      return fallback;
    }

    for (const key in input) {
      const value = input[key];
      if (callback(value, key)) {
        return value;
      }
    }

    return fallback;
  },

  filterByKey (input, callback) {
    return this.filter(input, (v, k) => callback(k, v));
  },

  /**
   * Has break functionality
   * @param input
   * @param callback
   */
  forEach (input, callback) {
    input = input || {};
    for (const key in input) {
      const value = input[key];
      if (callback(value, key) === false) {
        break;
      }
    }
  },

  map (input, callback) {
    input = input || {};
    const result = {};
    for (const key in input) {
      const value = input[key];
      result[key] = callback(value, key);
    }
    return result;
  },

  mapWithKeys (input, callback) {
    input = input || {};
    const result = {};
    for (const key in input) {
      const value = input[key];
      const assoc = callback(value, key);
      for (const mapKey in assoc) {
        result[mapKey] = assoc[mapKey];
      }
    }
    return result;
  },

  isEmpty (input) {
    if (!input) { return true; }
    return this.count(input) === 0;
  },

  count (input) {
    if (!input) { return 0; }
    return Object.entries(input).length;
  }
}
