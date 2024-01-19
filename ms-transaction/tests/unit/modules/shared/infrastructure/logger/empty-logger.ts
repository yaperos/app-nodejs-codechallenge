/* eslint-disable @typescript-eslint/no-empty-function */
import { LoggerService } from '@nestjs/common';

export class EmptyLogger implements LoggerService {
  log(): any {}
  error(): any {}
  warn(): any {}
  debug(): any {}
  verbose(): any {}
}
