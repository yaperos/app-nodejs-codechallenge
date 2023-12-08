import FasterValidator from 'fastest-validator';

export interface IError extends Error {
  statusCode?: number;
  validations: any;
}

export class ValidationError extends Error implements IError {
  validations: any;
  statusCode: number;
  constructor(result: any) {
    super('Validation failed');
    this.validations = result;
    this.statusCode = 400;
  }
}
