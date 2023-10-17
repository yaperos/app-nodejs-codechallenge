import { Controller, Get, Inject, Param } from '@nestjs/common';
import { FindTransaction } from 'src/transactions/domain/use-case/find-transaction';

@Controller('api/v1/transactions')
export class FindTransactionController {
  public constructor(
    @Inject('FIND_TRANSACTION')
    private readonly findTransaction: FindTransaction,
  ) {}

  @Get(':transactionId')
  public async execute(@Param('transactionId') transactionId: string) {
    return await this.findTransaction.execute(transactionId);
  }
}
