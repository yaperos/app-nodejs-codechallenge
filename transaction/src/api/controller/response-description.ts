export enum ResponseDescription {
  OK = 'The request was successful',
  CREATED = 'The resource was created or the operation not guaranteed to be idempotent succeeded',
  BAD_REQUEST = 'The request is not valid',
  NOT_FOUND = 'No transaction found matching the given id',
  INTERNAL_SERVER_ERROR = 'An unexpected error occurred inside the server',
}
