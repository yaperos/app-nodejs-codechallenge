export type ErrorObjectType = {
  reason: string;
  details: string;
  source?: string;
};

export type GlobalErrorObjectType = {
  message?: string;
  statusCode: number;
  errors: ErrorObjectType[];
};
export interface ApplicationException {
  error: GlobalErrorObjectType;
}
export class BaseException implements ApplicationException {
  error: GlobalErrorObjectType;

  constructor(error: GlobalErrorObjectType) {
    this.error = error;
  }
}

export class CustomException extends BaseException {}
