import { Body, Controller, Get, Inject, OnModuleInit, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { Kafka } from 'kafkajs';
import { CreateTransactionEventDto } from 'src/interfaces/create-transaction-event.dto';
import { CreateTransactionServiceRes } from 'src/interfaces/create-transaction-service-res';

@Controller('transaction')
export class TransactionController implements OnModuleInit {
  constructor(
    private readonly transactionService: TransactionService,
    @Inject('TRANSACTION_SERVICE') private client: ClientKafka
  ) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'transacion service',
      brokers: ['kafka:29092'],
    });
    const admin = kafka.admin();
    const topics = await admin.listTopics();

    if (!topics.includes('transactions_created')) {
      await admin.createTopics({
        topics: [{
          topic: 'transactions_created',
          replicationFactor: 1,
        }],
      });
    }

    if (!topics.includes('transactions_update')) {
      await admin.createTopics({
        topics: [{
          topic: 'transactions_update',
          replicationFactor: 1,
        }],
      });
    }
    this.client.subscribeToResponseOf('transactions_update');
  }

  @Post('create')
  async createTransaction(@Body() createTransactionDto: CreateTransactionReq): Promise<string> {
    const response: CreateTransactionServiceRes = await this.transactionService.createTransaction(createTransactionDto);

    if (response.ok) {
      const transactionEvent: CreateTransactionEventDto = new CreateTransactionEventDto();
      transactionEvent.transactionExternalId = response.transactionId;
      transactionEvent.value = createTransactionDto.value;
      this.client.emit('transactions_created', JSON.stringify({transactionEvent}));
    }
    return response.message;
  }

  @EventPattern('transactions_update')
  handler(@Payload() message: any) {
    this.transactionService.updateTransaction(message.transactionValidated);
  }

  @Get()
  async getAllTransactions(): Promise<any> {
    return this.transactionService.getAllTransactions();
  }
}
