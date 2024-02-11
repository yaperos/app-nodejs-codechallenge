import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionService } from '../services/transaction.service';
import { FindOneParams } from '../dtos/find-transaction.dto';
import { ClientKafka, MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('KAFKA_SERVICE') private kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    Logger.log('Connecting to Kafka', TransactionController.name);
    await this.kafka.connect();
    Logger.log('Connected to Kafka', TransactionController.name);
  }

  @MessagePattern('anti-fraud-response')
  getAntiFraudResponse(@Payload() message) {
    Logger.log('Received message', message);
    this.transactionService.updateStatus(message.id, message.status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction' })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions',
    type: Transaction,
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '1f4ab17b-8548-4b76-a7fd-c94fc0b95b77',
  })
  findOne(@Param() params: FindOneParams): Promise<Transaction> {
    return this.transactionService.findOne(params.id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a transaction' })
  @ApiResponse({
    status: 201,
    description: 'The transaction has been successfully created',
    type: Transaction,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'The status or type of the transaction is not valid',
  })
  @ApiBody({ type: CreateTransactionDto })
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    const createdTransaction: Transaction =
      await this.transactionService.create(createTransactionDto);
    this.kafka.emit(
      'transactions',
      JSON.stringify({
        id: createdTransaction.transactionExternalId,
        value: createdTransaction.value,
      }),
    );
  }
}
