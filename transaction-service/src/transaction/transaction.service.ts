import { Inject, Injectable } from '@nestjs/common';
import { TransactionCreatedEvent } from './event/transaction-created.event';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import Transaction from './transaction.entity';

@Injectable()
export class TransactionService {

  constructor(
    @Inject('ANTIFRAUD_SERVICE') private readonly antifraudClient: ClientKafka,
    @InjectRepository(Transaction) private transactionRepository: Repository<Transaction>,
  ) {}

  async handleTransactionCreated(transactionCreatedEvent: TransactionCreatedEvent){
    console.log(transactionCreatedEvent)
    const newRecord = await this.transactionRepository.create(transactionCreatedEvent);
    await this.transactionRepository.save(newRecord)
    await this.antifraudClient.emit('transaction_pending', JSON.stringify(newRecord))
  }

  async handleTransactionUpdated(transactionUpdatedEvent: TransactionCreatedEvent){
    const recordToUpdate = await this.transactionRepository.findOne({
      where: {
        id: transactionUpdatedEvent.id,
      }
    });
    recordToUpdate.status = transactionUpdatedEvent.status;
    await this.transactionRepository.save(recordToUpdate)
  }
}
