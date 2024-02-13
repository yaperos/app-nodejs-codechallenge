import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { TransactionService } from '../../domain/services/transaction.service';
import { Token } from '../constants';
import { TransactionTypeService } from '../../domain/services/transaction-type.service';
import {
  ResponseTransactionDto,
  getTransactionResponseDto,
} from '../dto/response-transaction.dto';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import {
  Ctx,
  EventPattern,
  KafkaContext,
  Payload,
} from '@nestjs/microservices';
import { TRANSACTION_VALIDATED } from '@app/common/constants';
import { RequestData, TransactionEvent } from '@app/common/interfaces';
import { GetParamTransactionDto } from '../dto/get-param-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    @Inject(Token.TRANSACTION)
    private readonly transactionService: TransactionService,
    @Inject(Token.TRANSACTION_TYPE)
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Get(':id')
  async getOne(
    @Param() param: GetParamTransactionDto,
  ): Promise<ResponseTransactionDto> {
    const transaction = await this.transactionService.getOne(param.id);
    const transactionType = await this.transactionTypeService.findOne(
      transaction.transactionTypeId,
    );

    return getTransactionResponseDto(transaction, transactionType);
  }

  @Post()
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<ResponseTransactionDto> {
    const transaction = await this.transactionService.create(
      createTransactionDto.toModel(),
    );
    await this.transactionService.emitNewTransactionNotification(transaction);

    const transactionType = await this.transactionTypeService.findOne(
      transaction.transactionTypeId,
    );

    return getTransactionResponseDto(transaction, transactionType);
  }

  @EventPattern(TRANSACTION_VALIDATED)
  async handleValidatedTransactionEvent(
    @Payload() { payload }: RequestData<TransactionEvent>,
  ) {
    await this.transactionService.updateStatusById(
      payload.transactionId,
      payload.status,
    );
  }
}
