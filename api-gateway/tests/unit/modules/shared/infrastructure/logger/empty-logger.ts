/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoggerService } from '@nestjs/common';

export class EmptyLogger implements LoggerService {
  log(message: string): any {}
  error(message: string, trace: string): any {}
  warn(message: string): any {}
  debug(message: string): any {}
  verbose(message: string): any {}
}
