import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AntiFraudService {
  private readonly logger = new Logger(AntiFraudService.name);

  verify(transactionValue): string {
    const status = Number(transactionValue) > 1000 ? 'rejected' : 'approved';
    this.logger.debug('transaction verified', status);
    return status;
  }
}
