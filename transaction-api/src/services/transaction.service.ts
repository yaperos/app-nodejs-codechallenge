import { Injectable, Logger } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { Transaction, TransactionStatus } from '../entity/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @Inject('ANTI_FRAUD_SERVICE')
    private readonly transactionClient: ClientKafka,
  ) {}

  findAll() {
    return this.transactionRepository.find();
  }

  findOneById(id: number) {
    return this.transactionRepository.findOneBy({ id });
  }

  create(data: CreateTransactionDto) {
    const transaction = new Transaction();
    transaction.accountExternalIdCredit = data.accountExternalIdCredit;
    transaction.accountExternalIdDebit = data.accountExternalIdDebit;
    transaction.tranferTypeId = data.tranferTypeId;
    transaction.value = data.value;

    return this.transactionRepository
      .save(transaction)
      .then((transactionCreated) => {
        Logger.debug(`Transaction created: ${transactionCreated.id}`);

        this.transactionClient.emit(
          'transaction.created',
          JSON.stringify({
            id: transactionCreated.id,
            value: transactionCreated.value,
          }),
        );

        return transactionCreated;
      });
  }

  async updateState(id: number, state: TransactionStatus) {
    const transaction = await this.findOneById(id);
    transaction.transactionStatus = state;
    Logger.debug(`Update transaction ${id} to state ${state}`);
    return this.transactionRepository.save(transaction);
  }

  delete(id: number) {
    return this.transactionRepository.delete(id);
  }
}
