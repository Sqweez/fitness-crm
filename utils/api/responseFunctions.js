import { __hardcoded } from '~/utils/helpers';
import ObjFunctions from '~/utils/support/ObjFunctions';

const ResponseFunctions = {
  retrieveSingleValidationErrorMessage (input) {
    if (input.response) {
      if (input.response.data) {
        // firstly: public validation errors
        if (input.response.data.message) {
          return input.response.data.message;
        }
        if (input.response.data.errors) {
          return this.retrieveSingleValidationErrorMessageFromInvalidField(input.response.data.errors);
        }

        if (input.response.data.invalid) {
          return this.retrieveSingleValidationErrorMessageFromInvalidField(input.response.data.invalid);
        }
      }
    }

    return __hardcoded('Произошла ошибка');
  },

  retrieveIsReportable (input) {
    if (input) {
      if (input.data) {
        if (input.data.unreportable) {
          return false;
        }
      }
    }
    return true;
  },

  retrieveSingleValidationErrorMessageFromInvalidField (invalid) {
    return this._firstString(invalid, __hardcoded('Произошла ошибка'));
  },

  retrieveSuccessMessage (input) {
    let result = '';
    if (input.data) {
      if (input.data.message) {
        result = input.data.message;
      }
    }
    return result;
  },

  retrieveValidationErrorsMap (input, doSinglePerField = true) {
    let result = {};

    if (input.response) {
      if (input.response.data) {
        if (input.response.data.errors) {
          result = input.response.data.errors;
        }
      }
    }

    if (doSinglePerField) {
      result = ObjFunctions.map(result, errorsList => this._firstString(errorsList));
    }

    return result;
  },

  _firstString (input, fallback = undefined) {
    if (Array.isArray(input)) {
      for (const value of input) {
        return this._firstString(value, fallback);
      }
      return fallback;
    }

    if (typeof input === 'object') {
      for (const key in input) {
        return this._firstString(input[key], fallback);
      }
      return fallback;
    }

    if (typeof input === 'string') {
      return input;
    }
    if (typeof input === 'number') {
      return input;
    }

    return input || fallback;
  },
};

export default ResponseFunctions;
