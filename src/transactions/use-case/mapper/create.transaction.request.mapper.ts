import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTransactionDto, TransactionStatus, TransactionType } from '../../adapter/in/http/dto/create-transaction-dto';
import { TransactionEntity } from '../../adapter/out/data/model/transaction.entity';

export class CreateTransactionRequestMapper {

    static async map(createTransactionDto: CreateTransactionDto): Promise<TransactionEntity> {
    const transactionEntity = new TransactionEntity();
    transactionEntity.id = uuidv4();
    transactionEntity.accountExternalIdDebit = createTransactionDto.accountExternalIdDebit;
    transactionEntity.accountExternalIdCredit = createTransactionDto.accountExternalIdCredit;
    transactionEntity.transactionType = TransactionType[createTransactionDto.transferTypeId];
    transactionEntity.amount = createTransactionDto.value;
    transactionEntity.transactionStatus = TransactionStatus.PENDING;
    return transactionEntity;
  }
}