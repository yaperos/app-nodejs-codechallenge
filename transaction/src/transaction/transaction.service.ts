import { Inject, Injectable } from '@nestjs/common';
import { Transaction, TransactionStatus } from './transaction.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClientKafka } from '@nestjs/microservices';
import { CreateTransactionDto } from './dto/transaction.dto';
import { v4 as uuid } from "uuid";
import { TransactionEvent } from './transaction.event';

@Injectable()
export class TransactionService {

  constructor(
    @Inject('KAFKA') private readonly clientEmit: ClientKafka,
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
  ){}

  async allTransaction(): Promise<Transaction[]> {
    return this.transactionRepository.find()
  }

  async newTransaction(body: CreateTransactionDto): Promise<Transaction> {

    const transaction = new Transaction()
    transaction.id = uuid();
    transaction.status = body.value > 1000 ? TransactionStatus.REJECTED : TransactionStatus.PENDING;
    transaction.type = body.tranferTypeId;
    transaction.value = body.value;
    transaction.createdAt = new Date();

    await this.transactionRepository.save( transaction )
    this.clientEmit.emit( TransactionEvent.getName(), TransactionEvent.toEvent(transaction) )
    return transaction
  }


  async approvedTransaction( id: string ): Promise<void> {
    await this.transactionRepository.update({ id }, { status: TransactionStatus.APPROVED })
  }

  async rejectTransaction( id: string ): Promise<void> {
    await this.transactionRepository.update({ id }, { status: TransactionStatus.REJECTED })
  }

}
