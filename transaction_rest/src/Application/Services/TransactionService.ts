import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import {
  RedisDomainService,
  ProducerKafkaDomainService,
} from '../../Domain/Services/';
import { Transaction } from '../../Domain/Entitys';
import { TRANSACTION_STATUS } from '../../Domain/Common';
import { CreateTransactionRequest } from '../Dto';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly redisDomainService: RedisDomainService,
    private readonly producerKafkaDomainService: ProducerKafkaDomainService,
  ) {}
  async getTransaction(idTransaction: string): Promise<Transaction> {
    this.logger.log('Init Get Transaction');
    this.logger.log(`idTransaction => ${idTransaction}`);
    const transactionCache = (await this.redisDomainService.getDataCache(
      idTransaction,
    )) as Transaction;
    if (transactionCache) {
      this.logger.log(`Cache Data => ${JSON.stringify(transactionCache)}`);
      return {
        ...transactionCache,
        createdAt: new Date(transactionCache.createdAt),
      };
    }
    const transaction = await this.transactionRepository.findOne({
      where: {
        transactionExternalId: idTransaction,
      },
    });
    this.logger.log(`Trnsaction found => ${JSON.stringify(transaction)}`);
    await this.redisDomainService.setDataCache(idTransaction, transaction);
    return transaction;
  }
  async createTransaction(
    object: CreateTransactionRequest,
  ): Promise<Transaction> {
    this.logger.log('Init Create Transaction');
    const {
      accountExternalIdCredit,
      accountExternalIdDebit,
      tranferTypeId,
      value,
    } = object;
    this.logger.log(`Request Transaction => ${JSON.stringify(object)}`);
    const transaction = this.transactionRepository.create({
      transactionExternalId: v4(),
      createdAt: new Date(),
      transactionStatus: {
        name: TRANSACTION_STATUS.PENDING_REVIEW,
      },
      accountExternalIdCredit,
      accountExternalIdDebit,
      tranferTypeId,
      value,
    });
    this.logger.log(
      `Create Transaction object => ${JSON.stringify(transaction)}`,
    );
    const producerRecord = {
      topic: this.configService.get<string>('KAFKA_TOPIC'),
      messages: [
        {
          key: this.configService.get<string>('ANTI_FRAUD_CLIENT'),
          value: JSON.stringify({
            transactionExternalId: transaction.transactionExternalId,
          }),
        },
      ],
    };
    const resultSave = await this.transactionRepository.save(transaction);
    this.logger.log(`Result save transaction => ${JSON.stringify(resultSave)}`);
    this.logger.log(
      `Transaction record to kafka => ${JSON.stringify(producerRecord)}`,
    );
    const resultSenMessage = await this.producerKafkaDomainService.sendMessage(
      producerRecord,
    );
    this.logger.log(
      `Result Send Transaction=> ${JSON.stringify(resultSenMessage)}`,
    );
    return resultSave;
  }
  async updateTrsansactionStatus(
    idTransaction: string,
    status: string,
  ): Promise<Transaction> {
    this.logger.log('Init Update Transaction');
    this.logger.log(`idTransaction => ${idTransaction}`);
    this.logger.log(`status => ${status}`);
    await this.redisDomainService.deleteDataCache(idTransaction);
    return this.transactionRepository.save({
      transactionExternalId: idTransaction,
      transactionStatus: {
        name: status,
      },
    });
  }
}
