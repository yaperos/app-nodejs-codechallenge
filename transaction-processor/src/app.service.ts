import { CreateTransactionInputDto } from './dtos/create-transaction.input';
import { CreateTransactionOutputDto } from './dtos/create-transaction.output';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './entities/transaction.entity';
import { TransactionStatusDto } from './dtos/transaction-status.dto';

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
    createTransactionOutputDto.transactionExternalId =
      transaction.transactionExternalId;
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

  public async transactionStatusUpdate(
    transactionStatusDto: TransactionStatusDto,
  ): Promise<void> {
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: transactionStatusDto.transactionExternalId,
      },
    });
    if (!transaction) {
      console.log('Transaction not found');
      return;
    }
    transaction.status = transactionStatusDto.transactionStatus.name;
    await this.transactionRepository.save(transaction);
  }
}
