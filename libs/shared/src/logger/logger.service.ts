import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger = new Logger();

  async info(type: string, data: any, id?: string | number) {
    this.logger.log({ type, data, id });
  }

  async error(type: string, data: any, id?: string | number) {
    this.logger.error({ type, data, id });
  }

  async warn(type: string, data: any, id?: string | number) {
    this.logger.warn({ type, data, id });
  }

  async debug(type: string, data: any, id?: string | number) {
    this.logger.debug({ type, data, id });
  }
}
