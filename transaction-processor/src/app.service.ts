import { CreateTransactionInputDto } from './dto/create-transaction.input';
import { CreateTransactionOutputDto } from './dto/create-transaction.output';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
// uuid
import { randomUUID } from 'crypto';

@Injectable()
export class AppService {
  public constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('this.transactionRepository', this.transactionRepository);
    console.log('this.kafkaClient', this.kafkaClient);
  }

  public async create(
    createTransactionDto: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    console.log('createTransactionDto', createTransactionDto);
    const transaction = this.transactionRepository.create(createTransactionDto);
    await this.transactionRepository.save(transaction);
    this.kafkaClient.emit(
      'transaction_created_topic',
      JSON.stringify(transaction),
    );
    const createTransactionOutputDto = new CreateTransactionOutputDto();
    createTransactionOutputDto.transactionExternalId = randomUUID();
    createTransactionOutputDto.accountExternalIdDebit =
      transaction.accountExternalIdDebit;
    createTransactionOutputDto.accountExternalIdCredit =
      transaction.accountExternalIdCredit;
    createTransactionOutputDto.value = transaction.value;
    createTransactionOutputDto.createdAt = new Date();
    return createTransactionOutputDto;
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find();
  }
}
