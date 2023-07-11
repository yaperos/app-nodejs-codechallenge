import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { KafkaService } from '../kafka/kafka';

@Injectable()
export class TransactionsService {

  public constructor(
    @InjectModel(Transaction.name) private model: Model<Transaction>,
    private readonly events: KafkaService,
  ) {}

  public async findAll(): Promise<Transaction[]> {
    return this.model.find().exec();
  }

  public async registerApproval(data): Promise<void> {
    //TODO
  }

  public async findOne(id: string): Promise<Transaction> {
    await this.events.emit('transaction_created', {
      key: (new Date).getTime().toString(),
      value: JSON.stringify({id: 'testing'})
    });

    return this.model.findById(id).exec();
  }
}
