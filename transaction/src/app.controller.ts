import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionDto } from './infrastructure/dtos/transaction.dto';
import { GetTransaction } from './application/query/getTransaction';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostTransactionCommand } from './application/command/postTransaction';
import { TransactionCreateDto } from './infrastructure/dtos/transaction.create.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionUpdateDto } from './infrastructure/dtos/transaction.update.dto';
import { UpdateTransactionCommand } from './application/command/updateTransaction';


@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly appService: AppService,
    private readonly commandB: CommandBus,
    private readonly queryB: QueryBus
  ) {}

  @Get(':transactionId')
  async getTransaction(@Param() userParams:TransactionDto){
    const queryTr = new GetTransaction(userParams.transactionId);
    return await this.queryB.execute(queryTr);
  }

  @Post()
  async create(@Body() data: TransactionCreateDto){
    const {accountExternalIdDebit, accountExternalIdCredit, transferTypeId , value} = data;
    const commandTr = new PostTransactionCommand(accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value);
    
    return await this.commandB.execute(commandTr);
  }

  @MessagePattern('transaction-update')
  async handleEventUpdateTransaction(@Payload() data: TransactionUpdateDto) {
    const { transactionExternalId, status } = data;
    const command = new UpdateTransactionCommand(transactionExternalId, status);
    await this.commandB.execute(command);
  }
}
