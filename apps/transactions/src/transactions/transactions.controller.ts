import { Body, Controller, Get, Post } from '@nestjs/common';
import { DataTransactionCreateDTO } from './transactions.dto';
import { TransactionsUseCase } from './transactions.usecase';
import { SubscribeTo } from 'src/kafka/kafka.decorator';
import { TransactionsEntity } from '@app/common/database/models';
import { TOPICS } from './transactions.constants';

@Controller('transactions')
export class TransactionsController {
  constructor(public readonly transactionsUseCase: TransactionsUseCase) {}

  @SubscribeTo(TOPICS.APPROVED_TRANSACTION)
  approvedEvent(payload: string) {
    this.transactionsUseCase.updateTransaction(payload);
  }

  @SubscribeTo(TOPICS.REJECTED_TRANSACTION)
  rejectedEvent(payload: string) {
    this.transactionsUseCase.updateTransaction(payload);
  }

  @Get()
  async listTransaction(): Promise<TransactionsEntity[]> {
    const resp = await this.transactionsUseCase.listTransaction();
    return resp;
  }

  @Post()
  async createTransaction(
    @Body() request: DataTransactionCreateDTO,
  ): Promise<TransactionsEntity> {
    const resp = await this.transactionsUseCase.createTransaction(request);
    return resp;
  }
}
