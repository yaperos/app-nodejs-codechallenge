import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  error(message: string, trace: string) {
    console.error(message, trace);
  }

  log(message: string) {
    console.log(message);
  }

  warn(message: string) {
    console.warn(message);
  }
}
