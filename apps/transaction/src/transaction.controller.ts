import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/create-trasaction.dto';
import { END_TRANSACTION_VALIDATED } from '@app/common/constans/topics';
import { AntiFraud, RequestData } from '@app/common/interfaces';
import {
  responseDto,
  ResponseTransactionDto,
} from './dto/response-transaction.dto';

@Controller('api/transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body() trabsactionDto: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    const { transaction, transactionType } =
      await this.transactionService.create(trabsactionDto);
    await this.transactionService.emitTransactionToAntiFraud(transaction);

    return responseDto(transaction, transactionType);
  }

  @Get(':transactionExternalId')
  async getTranactionById(
    @Param('transactionExternalId') transactionExternalId: string,
  ) {
    const { transaction, transactionType } =
      await this.transactionService.findOne(transactionExternalId);

    return responseDto(transaction, transactionType);
  }

  @EventPattern(END_TRANSACTION_VALIDATED)
  async handleTransactionValidated(
    @Payload() { payload }: RequestData<AntiFraud>,
    @Ctx() context: KafkaContext,
  ) {
    await this.transactionService.updateStatus(payload);
  }
}
