import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AntifraudService {
  private readonly MAX_TRANSACTION_VALUE: number;

  constructor(private configService: ConfigService) {
    this.MAX_TRANSACTION_VALUE = this.configService.get(
      'MAX_TRANSACTION_VALUE',
    );
  }

  public validateTransaction(transaction: { id: string; value: number }) {
    if (transaction.value > Number(this.MAX_TRANSACTION_VALUE)) {
      return 'failed';
    }

    return 'approved';
  }
}
