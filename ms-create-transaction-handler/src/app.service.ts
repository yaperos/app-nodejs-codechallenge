import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventType } from './enum/event-type';
import { Transaction } from './entities/transaction.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ClientKafka } from '@nestjs/microservices';
import { Event } from './interface/event';

@Injectable()
export class AppService {
  constructor(
    @Inject('VALIDATION_SERVICE')
    private readonly transactionClient: ClientKafka,

    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) {}

  async handleTransaction(event: Event) {
    if (event.type === EventType.CREATE) {
      return this.handleCreateTransaction(event.params);
    }

    if (event.type === EventType.UPDATE) {
      return this.handleUpdateTransaction(event.params);
    }

    throw new InternalServerErrorException('Invalid event type');
  }

  async handleCreateTransaction(eventToCreate) {
    const transaction = await this.transactionModel.create(eventToCreate);

    if (!transaction) {
      throw new InternalServerErrorException('Transaction not saved');
    }

    this.transactionClient.emit(
      'validation_queue',
      JSON.stringify({
        id: transaction._id,
        value: transaction.value,
      }),
    );
    return transaction;
  }

  async handleUpdateTransaction(eventToUpdate) {
    const { id, transactionStatus } = eventToUpdate;
    const transaction = await this.transactionModel.findById({ _id: id });
    if (!transaction) {
      throw new InternalServerErrorException('Transaction not found');
    }
    return await this.transactionModel.updateOne(
      { _id: id },
      { transactionStatus },
    );
  }
}
