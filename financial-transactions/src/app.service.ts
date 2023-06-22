/* eslint-disable prettier/prettier */
import { Inject, Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { TransactionRequestDto } from './dto/request/transaction.request.dto';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { FinancialTransaction } from './entities/financial-transaction.entity';
import { Repository } from 'typeorm';
import { TransactionStatusRequestDto } from './dto/request/transaction-status.request.dto';
import { TransactionStatus } from './constans/transaction-status.enum';
import { SEND_TRANSACTION_TOPIC, VERIFY_TRANSACTION_TOPIC } from './constans/kakfa-topics';
import { v4 as uuidv4 } from 'uuid';
import { TransactionResponseDto } from './dto/response/transaction.response.dto';

@Injectable()
export class AppService implements OnModuleInit {

  constructor(
    @Inject('ANTI_FRAUD_MICROSERVICE') private readonly kafkaClient: ClientKafka,
    @InjectRepository(FinancialTransaction) private financialTransactionRepository: Repository<FinancialTransaction>
  ) { }


  onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(SEND_TRANSACTION_TOPIC);
  }



  async createFinancialTransaction(transactionRequestDto: TransactionRequestDto) {
    const transactionSaved = await this.financialTransactionRepository.save({
      ...transactionRequestDto,
      transactionExternalId: uuidv4(),
      accountExternalIdCredit: uuidv4(),
      accountExternalIdDebit: uuidv4(),
      transactionStatus: TransactionStatus.PENDING,
      createdAt: new Date(),
    })

    this.kafkaClient
      .emit(VERIFY_TRANSACTION_TOPIC, JSON.stringify(transactionSaved))

    return {
      data: {
        transactionStatus: transactionSaved.transactionStatus,
        transactionExternalId: transactionSaved.transactionExternalId,
        transactionDate: transactionSaved.createdAt.toISOString()
      }
    }
  }

  async findFinancialTransactionByExternalId(transactionExternalId: string) {
    const transaction = await this.financialTransactionRepository.findOne({
      where: {
        transactionExternalId: transactionExternalId,
      }
    })
    return {
      data: new TransactionResponseDto(transaction)
    }
  }

  async updateStatusTransaction(transactionStatusRequestDto: TransactionStatusRequestDto): Promise<void> {
    const transaction = await this.financialTransactionRepository.findOne({
      where: {
        transactionExternalId: transactionStatusRequestDto.transactionExternalId,
      }
    })

    if (transaction) {
      await this.financialTransactionRepository.update(transaction.id, {
        ...transaction,
        transactionStatus: transactionStatusRequestDto.transactionStatus
      })
    }
  }


}
