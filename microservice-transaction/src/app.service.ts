import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionStatuses, TransactionVerified } from './domain/transaction';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA')
    private readonly kafkaService: ClientProxy,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly configService: ConfigService
  ) {}

  async saveTransaction(transactionDto: TransactionDto) {
    try {
      const transaction = this.transactionRepository.create({
        ...transactionDto,
        transactionStatus: TransactionStatuses.Pending,
      });
  
      await this.transactionRepository.save(transaction);

      return this.kafkaService.emit(this.configService.get('KAFKA_TOPIC_TRANSACTION_CREATED'),{
        "transactionExternalId": transaction.transactionExternalId,
        "transactionType": {
          "name": transaction.tranferTypeId
        },
        "transactionStatus": {
          "name": transaction.transactionStatus
        },
        "transactionValue": transaction.value,
        "createdAt": transaction.createdAt
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }

  async updateTransaction(transactionToUpdate: TransactionVerified) {
    try {
      console.log(transactionToUpdate);
    const { transactionExternalId, transactionStatus, transactionValue } = transactionToUpdate;
    const { accountExternalIdCredit, accountExternalIdDebit, tranferTypeId} = await this.transactionRepository.preload({ transactionExternalId })
    
    const newRegisterTransaction = this.transactionRepository.create({
      accountExternalIdCredit,
      accountExternalIdDebit,
      tranferTypeId,
      value: transactionValue,
      transactionStatus: transactionStatus.name,
    });
    this.transactionRepository.save(newRegisterTransaction);
    Logger.log('Transaccion Updated Event')

    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }
}
