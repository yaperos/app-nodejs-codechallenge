import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientRedis } from '@nestjs/microservices';
import { CreateTransactionDto } from '@nestjs-microservices/shared/dto';
import { firstValueFrom } from 'rxjs';
import Redis from 'ioredis';
@Injectable()
export class TransactionService implements OnModuleInit {
  private redisClient: Redis;

  constructor(
    @Inject('TRANSACTION_MICROSERVICE')
    private readonly transactionClient: ClientKafka
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    console.log('Emitting transaction.create event');

    await this.transactionClient.emit(
      'transaction.create',
      JSON.stringify(createTransactionDto)
    );
    return { success: true };
  }

  async getTransactionById(id: string) {
    // check if the transaction is in redis
    console.log(`Checking for transaction ${id} in redis`);

    const cachedTransaction = await this.redisClient.get(id);

    if (cachedTransaction) {
      console.log(`Transaction ${id} found in redis`);
      return JSON.parse(cachedTransaction);
    }

    console.log(`Transaction ${id} Not found in redis`);

    const transaction = await firstValueFrom(
      this.transactionClient.send('transaction.get', JSON.stringify({ id }))
    );

    // set the key in redis for 30 min
    console.log(`Saving transaction ${id} in redis for 30 minutes`);

    await this.redisClient.set(id, JSON.stringify(transaction), 'EX', 1800);

    return transaction;
  }

  async onModuleInit() {
    this.transactionClient.subscribeToResponseOf('transaction.get');
    await this.transactionClient.connect();
    this.redisClient = new Redis();
  }
}
