import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { NewTransactionEvent } from 'src/anti-fraud/events/new-transaction.event';
import { TransactionStatusChangeEvent } from 'src/anti-fraud/events/transaction-status-change.event';
import { TransactionDto } from 'src/shared/dtos/transaction.dto';
import { TransactionStatusEnum } from 'src/shared/enums/transaction-status.enum';
import {
  TRANSACTION_CREATED,
  TRANSACTION_STATUS_APPROVED,
  TRANSACTION_STATUS_REJECTED,
} from 'src/shared/events';
import { NewTransactionDto } from '../shared/dtos/NewTransaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transaction')
@UsePipes(new ValidationPipe({ transform: true }))
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    @Inject('ANTIFRAUD_SERVICE') private readonly clientKafka: ClientKafka,
  ) {}

  @Post()
  async createTransaction(
    @Body() body: NewTransactionDto,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionsService.create(body);

    const createdEvent = new NewTransactionEvent(
      transaction.transactionExternalId,
      transaction.value,
    );

    this.clientKafka.emit(TRANSACTION_CREATED, createdEvent);

    return new TransactionDto(transaction);
  }

  @Get(':id')
  async findOne(
    // prettier-ignore
    @Param('id', new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: string,
  ): Promise<TransactionDto> {
    const transaction = await this.transactionsService.findOne(id);

    if (!transaction) {
      throw new NotFoundException();
    }

    return new TransactionDto(transaction);
  }

  @Get()
  async findAll(
    @Query('status')
    transactionStatus?: TransactionStatusEnum,
  ): Promise<TransactionDto[]> {
    if (
      transactionStatus !== undefined &&
      (typeof transactionStatus !== 'string' ||
        !Object.values(TransactionStatusEnum).includes(transactionStatus))
    ) {
      throw new BadRequestException(
        `Validation failed (must be one of ${Object.values(
          TransactionStatusEnum,
        ).join(', ')})`,
      );
    }

    const transactionList = await this.transactionsService.findAll({
      transactionStatus,
    });

    const dtoList = transactionList.map((t) => new TransactionDto(t));

    return dtoList;
  }

  @EventPattern(TRANSACTION_STATUS_APPROVED)
  async handlerTransactionStatusApproved(
    @Payload() event: TransactionStatusChangeEvent,
  ) {
    await this.transactionsService.updateStatus(
      event.transactionExternalId,
      event.status,
    );
  }

  @EventPattern(TRANSACTION_STATUS_REJECTED)
  async handlerTransactionStatusRejected(
    @Payload() event: TransactionStatusChangeEvent,
  ) {
    await this.transactionsService.updateStatus(
      event.transactionExternalId,
      event.status,
    );
  }
}
