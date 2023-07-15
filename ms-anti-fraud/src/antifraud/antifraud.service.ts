import { Injectable } from '@nestjs/common';
import { TRANSACTION_STATUS } from './constant/status.const';
import env from 'src/confi/env';
import { RequestTransactionDto } from './dto/request-transaction';
import { ResponseTransactionDto } from './dto/response-transaction';

@Injectable()
export class AntifraudService {
  public validateTransaction(
    transaction: RequestTransactionDto,
  ): ResponseTransactionDto {
    const status =
      Number(transaction.amount) > Number(env.MAX_TRANSACTION_VALUE)
        ? TRANSACTION_STATUS.REJECTED
        : TRANSACTION_STATUS.APPROVED;
    return {
      id: transaction.id,
      status,
    };
  }
}
