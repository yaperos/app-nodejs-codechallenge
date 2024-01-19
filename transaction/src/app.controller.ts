import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionDto } from './infrastructure/dtos/transaction.dto';
import { GetTransaction } from './application/query/getTransaction';
import { CommandBus, QueryBus } from '@nestjs/cqrs';


@Controller()
export class TransactionController {
  constructor(
    private readonly appService: AppService,
    private readonly command: CommandBus,
    private readonly queryB: QueryBus
  ) {}

  @Get(':transactionId')
  async getTransaction(@Param() userParams:TransactionDto){
    const query = new GetTransaction(userParams.transactionId);
    console.log(query);
    return await this.queryB.execute(query);
  }
}
