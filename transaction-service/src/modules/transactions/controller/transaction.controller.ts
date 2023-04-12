import {Controller, Inject} from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import {ClientKafka, MessagePattern, Payload} from '@nestjs/microservices';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    // @Inject('TRANSACTION_SERVICE') private readonly client: ClientKafka,
  ) {}

  @MessagePattern('transaction.create')
  async createTransaction(@Payload() transactionPayload: transactionDTO) {
    console.log('CREATE TRANSACTION: ', transactionPayload)
    return this.transactionService.createTransaction(transactionPayload);
  }
}

export interface transactionDTO {
  requestId: string;
  payload: {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    amount: number;
    transferTypeId: number;
  }
}
