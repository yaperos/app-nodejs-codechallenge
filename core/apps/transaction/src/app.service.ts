import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'apps/shared/database/entities/transaction.entity';
import StatusEnum from 'apps/shared/database/enums/status.enum';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {

  constructor(@Inject(KafkaEnum.Name) private readonly client: ClientKafka,
  @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>) {
    
  }
    
  async onModuleInit(){
    this.client.subscribeToResponseOf('transaction');
    await this.client.connect();
  }

  async createTransaction(body) {
    const transaction = await this.transactionRepository.create({
      ...body,
      transactionStatus: StatusEnum.PENDING
    });
    const transactionObj = await this.transactionRepository.save(transaction)
    let transactKafka = await this.client.send('transaction',  JSON.stringify(transactionObj));
    return transactKafka;
  }

  async getTransaction() {
    const transaction = await this.transactionRepository.find();
    return transaction;
  }
}
