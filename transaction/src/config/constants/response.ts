const GENERIC_ERROR_MESSAGE =
  'Ups... Ha ocurrido un error inesperado. Comunícate con nuestro equipo.';

export const INFO_RESPONSES = {
  REQUEST_ACCEPTED: {
    MESSAGE: 'Message sent successfully',
  },
  HEALTHCHECK_FAILED: {
    STATUS: 500,
    MESSAGE: 'HealthCheck failed.',
  },
  ALIVE_OK: {
    STATUS: 200,
    MESSAGE: 'Alive OK.',
  },
  ALIVE_FAILED: {
    STATUS: 500,
    MESSAGE: 'AliveCheck failed.',
  },
  UNAUTHORIZED: {
    STATUS: 401,
    MESSAGE: 'La sesión ha caducado. Vuelve a iniciar sesión.',
  },
  STATUS: 200,
  MESSAGE: '',
};

export const GCP_ERROR_RESPONSES = {
  GENERIC_ERROR: {
    STATUS: 400,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  BAD_REQUEST: {
    STATUS: 400,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  NOT_FOUND: {
    STATUS: 404,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  METHOD_NOT_ALLOWED: {
    STATUS: 405,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  TIMEOUT: {
    STATUS: 408,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  BAD_GATEWAY: {
    STATUS: 502,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  SERVICE_UNAVAILABLE: {
    STATUS: 503,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  INSUFFICIENT_STORAGE: {
    STATUS: 507,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  FORBIDDEN: {
    STATUS: 403,
    MESSAGE: GENERIC_ERROR_MESSAGE,
  },
  STATUS: 200,
  MESSAGE: ''
};

