import { Controller, Inject } from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@Controller('transactions')
export class TransactionController {
  constructor(
    private transactionService: TransactionService, // @Inject('TRANSACTION_SERVICE') private readonly client: ClientKafka,
  ) {}

  @MessagePattern('transaction.create')
  async createTransaction(@Payload() transactionPayload: transactionDTO) {
    const result = await this.transactionService.createTransaction(
      transactionPayload,
    );
    return {
      requestId: transactionPayload.requestId,
      result: {
        transactionExternalId: result.transactionExternalId,
        transferTypeId: result.transferTypeId,
        transactionStatus: result.transactionStatus,
        amount: result.amount,
        createdAt: result.created_at,
      },
    };
  }
}

export interface transactionDTO {
  requestId: string;
  payload: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    amount: number;
    transferTypeId: number;
  };
}
