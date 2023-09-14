import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CreateTransaction } from '../../application/create-transaction';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { plainToInstance } from 'class-transformer';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { FindTransaction } from '../../application/find-transaction';
import { MessageKafkaPayloadDto } from '../dtos/message-kafka-payload.dto';
import { UpdateTransaction } from '../../application/update-transaction';
import { TransactionFindParamsDto } from '../dtos/transaction-find-params.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly createTransaction: CreateTransaction,
    private readonly findTransaction: FindTransaction,
    private readonly updateTransaction: UpdateTransaction,
    @Inject('YAPE')
    private readonly kafka: ClientProxy,
  ) {}

  @Post('/')
  public async create(
    @Body() data: CreateTransactionDto,
  ): Promise<CreateTransactionDto> {
    const transaction = await this.createTransaction.process(data);
    const response = plainToInstance(CreateTransactionDto, transaction.plain());
    this.kafka.emit('Anti-Fraud', JSON.stringify(response));
    return response;
  }

  @Get(':transactionExternalId')
  public async findTransactionById(@Param() params: TransactionFindParamsDto) {
    const { transactionExternalId } = params;
    const transaction = await this.findTransaction.process({
      id: transactionExternalId,
    });
    return transaction;
  }

  @MessagePattern('Anti-Fraud')
  public async messageTransaction(@Payload() payload: MessageKafkaPayloadDto) {
    Logger.log(
      'Payload que regresa cuando se consume la cola',
      JSON.stringify(payload),
    );
    const response = await this.updateTransaction.process(payload);
    const data = plainToInstance(MessageKafkaPayloadDto, response.plain());
    Logger.log('message', JSON.stringify(data));
  }
}
