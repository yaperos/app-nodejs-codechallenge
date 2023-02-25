export const SKIP_FIELDS = {
  _id: 0,
  __v: 0,
};

export enum BIT_VALUE {
  FALSE,
  TRUE,
}

export enum CRUD {
  CREATE = 'C',
  READ = 'R',
  UPDATE = 'U',
  DELETE = 'D',
}

export enum TIME_TYPE {
  HOURS = 'h',
  MINUTES = 'm',
  SECONDS = 's',
}
export const KAFKA_TOPICS = {
  TRANSACTION_REQUEST_VALIDATE: 'transaction_request_validate',
  TRANSACTION_RESPONSE_VALIDATE: 'transaction_response_validate',
}