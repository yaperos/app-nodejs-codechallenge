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
    @InjectRepository(Transaction, 'shard1Connection')
    private shard1Repository: Repository<Transaction>,
    @InjectRepository(Transaction, 'shard2Connection')
    private shard2Repository: Repository<Transaction>,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {
    console.log('this.kafkaClient', this.kafkaClient);
  }

  private getRepository(transferTypeId: number): Repository<Transaction> {
    // for architecture, transfer id types are 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
    const THRESHOLD = 5;
    return transferTypeId < THRESHOLD
      ? this.shard1Repository
      : this.shard2Repository;
  }

  public async create(
    createTransactionDto: CreateTransactionInputDto,
  ): Promise<CreateTransactionOutputDto> {
    console.log('createTransactionDto', createTransactionDto);
    const transactionRepository = this.getRepository(
      createTransactionDto.transferTypeId,
    );

    const transaction = transactionRepository.create(createTransactionDto);
    await transactionRepository.save(transaction);
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
    const transactions = await this.shard1Repository.find();
    const transactions2 = await this.shard2Repository.find();
    return [...transactions, ...transactions2];
  }

  public async transactionStatusUpdateApproved(
    transactionStatusDto: TransactionStatusDto,
  ): Promise<void> {
    // other logic for approved
    const transactionRepository = this.getRepository(
      Number(transactionStatusDto.transactionType.name),
    );
    const transaction = await transactionRepository.findOne({
      where: {
        transactionExternalId: transactionStatusDto.transactionExternalId,
      },
    });
    if (!transaction) {
      console.log('Transaction not found');
      return;
    }
    transaction.status = transactionStatusDto.transactionStatus.name;
    await transactionRepository.save(transaction);
  }
  public async transactionStatusUpdateRejected(
    transactionStatusDto: TransactionStatusDto,
  ): Promise<void> {
    // other logic for rejected
    const transactionRepository = this.getRepository(
      Number(transactionStatusDto.transactionType.name),
    );
    const transaction = await transactionRepository.findOne({
      where: {
        transactionExternalId: transactionStatusDto.transactionExternalId,
      },
    });
    if (!transaction) {
      console.log('Transaction not found');
      return;
    }
    transaction.status = transactionStatusDto.transactionStatus.name;
    await transactionRepository.save(transaction);
  }
}
