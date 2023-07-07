export const ErrMessage = {
  400: {
    BAD_REQUEST: 'Bad Request',
    TIME_LIMIT: 'Time limit exceeded',
    NO_MATCH: 'No match',
    NO_FUNDS: 'No funds',
    FAILED: 'Failed',
  },
  401: {
    EXCEEDED_LIMIT: 'Exceeded limit',
    INVALID: 'Invalid',
  },
  403: {
    NOT_YOU: 'User has no access',
  },
  404: 'Not Found',
  409: {
    ALREADY_REGISTERED: 'Already registered',
  },
  429: {
    EXCEEDED_LIMIT: 'Exceeded limit',
  },
  500: {
    DATABASE: {
      STORE: 'Error while storing',
    },
    FILE_SYSTEM: {
      READ: 'Error while reading file',
    },
    TYPE: {
      NUMBER: 'Not a number',
      DATE: 'Not a date',
      STRING: 'Not a string',
      NO_MATCH: 'Expected type not match',
    },
    UNDEFINED: {
      VARIABLE: 'Undefined variable',
    },
    THIRD_PARTY_UNHANDLED: 'Unhandled third party error',
  },
  503: {
    THIRD_PARTY: 'Third party service unavailable',
    THIRD_PARTY_ERROR: 'Third party service error',
  },
};

export const ApiDescriptions = {
  401: {
    NOT_LOGGED_IN: 'Not logged in',
  },
  403: {
    NOT_ALLOWED: 'Not allowed',
  },
};
