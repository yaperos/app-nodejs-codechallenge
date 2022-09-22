import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  getHello(): string {
    return 'Hello World!';
  }

  check(data: any) {
    this.logger.log('Checked data...', data);
  }
}
