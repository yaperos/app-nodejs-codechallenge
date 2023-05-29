import {
  TransactionStatus,
  Transactions,
} from '../../adapters/database/mongo/transactions/transactions.schema';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TransactionsService } from './transactions.service';
import { ValidateMongoId } from '../../common/pipe/validate-uuid-id.pipe';
import {
  ErrorTransactionsDto,
  TransactionsDto,
  TransactionsCreateDto,
  TransactionsResponseDto,
  TransactionValidationMessageDto,
} from './dto';
import { KafkaProducerService } from 'src/adapters/externalService/kafka/kafka.producer.service';
import { TypesService } from 'src/modules/types/types.service';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Controller('api/transactions')
@ApiTags('Transactions')
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly producerService: KafkaProducerService,
    private readonly typesService: TypesService,
  ) {}

  @ApiOkResponse({
    description: '200',
    type: TransactionsResponseDto,
  })
  @ApiForbiddenResponse({
    description: '403 Forbidden',
    type: ErrorTransactionsDto,
  })
  @Get(':transactionExternalId')
  @HttpCode(HttpStatus.OK)
  getTransactionsById(
    @Param('transactionExternalId', ValidateMongoId) id: string,
  ): Promise<Transactions> {
    return this.transactionsService.getTransactionById(id);
  }

  @ApiOkResponse({
    description: '200',
    type: [TransactionsResponseDto],
  })
  @ApiForbiddenResponse({
    description: '403 Forbidden',
    type: ErrorTransactionsDto,
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  getAllTransactions(): Promise<Transactions[]> {
    return this.transactionsService.getTransactions();
  }

  @ApiCreatedResponse({
    description: '201 Created',
    type: TransactionsResponseDto,
  })
  @ApiForbiddenResponse({
    description: '403 Forbidden',
    type: ErrorTransactionsDto,
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() transactionsCreateDto: TransactionsCreateDto,
  ): Promise<Transactions> {
    const transactionType = await this.typesService.getType(
      transactionsCreateDto.transferTypeId,
    );

    if (!transactionType) {
      throw new Error('Invalid transfer type');
    }

    const transactionsDto: TransactionsDto = {
      ...transactionsCreateDto,
      transactionType: {
        name: transactionType.name,
      },
      transactionStatus: {
        name: TransactionStatus.PENDING,
      },
    };

    // Create transaction
    const newTransaction = await this.transactionsService.createTransaction(
      transactionsDto,
    );

    const sendTransaction: TransactionValidationMessageDto = {
      transactionId: newTransaction.transactionExternalId,
      value: newTransaction.value,
    };

    // Send transaction to kafka
    await this.producerService.produce({
      topic: configService.get('KAFKA_TOPIC_TRANSACTION_CREATED'),
      messages: [{ value: JSON.stringify(sendTransaction) }],
    });

    return newTransaction;
  }
}
