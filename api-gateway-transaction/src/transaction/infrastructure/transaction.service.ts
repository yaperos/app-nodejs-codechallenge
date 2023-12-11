import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { Transaction } from './persistance/mongo/MongoTransaction';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_SERVICE')
    private readonly transactionClient: ClientKafka,

    @InjectModel(Transaction.name)
    private readonly transactionRepository: Model<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const transaction = {
      ...createTransactionDto,
      createdAt: new Date(),
    };

    this.transactionClient.emit(
      'transaction_queue',
      JSON.stringify({
        type: 'CREATE',
        params: { ...transaction },
      }),
    );
    return transaction;
  }

  async findOne(id: string) {
    let transaction;
    if (isValidObjectId(id)) {
      transaction = await this.transactionRepository.findById(id);
    }

    if (!transaction) throw new NotFoundException('Transaction not found');
    return {
      transactionExternalId: transaction.accountExternalIdDebit,
      transactionType: {
        name: '',
      },
      transactionStatus: {
        name: transaction.transactionStatus,
      },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
