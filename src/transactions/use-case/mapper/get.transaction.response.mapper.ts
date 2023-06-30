import { Injectable } from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import { GetTransactionResponseDto, TransactionStatusDto, TransactionTypeDto } from '../../adapter/in/http/dto/get-transaction-response-dto';
import { TransactionEntity } from '../../adapter/out/data/model/transaction.entity';

@Injectable()
export class GetTransactionResponseMapper {

    static async map(transaction: TransactionEntity): Promise<GetTransactionResponseDto> {
    const getTransactionResponseDto = new GetTransactionResponseDto();
    getTransactionResponseDto.transactionExternalId = transaction.id;
    getTransactionResponseDto.value = transaction.amount;
    getTransactionResponseDto.createAt = transaction.createAt;
    const transactionTypeDto = new TransactionTypeDto();
    transactionTypeDto.name = transaction.transactionType;
    getTransactionResponseDto.transactionType = transactionTypeDto;
    const transactionStatusDto = new TransactionStatusDto();
    transactionStatusDto.name = transaction.transactionStatus;
    getTransactionResponseDto.transactionStatus = transactionStatusDto;
    return getTransactionResponseDto;
  }
}