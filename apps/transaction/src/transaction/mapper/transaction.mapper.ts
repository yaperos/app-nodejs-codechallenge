import { CreateTransactionDto } from '../dto/request/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { Injectable } from '@nestjs/common';
import { TransactionCreatedDto } from '../dto/response/transaction-created.dto';
import { UpdateTransactionDto } from '../dto/request/update-transaction.dto';
import { TransactionUpdatedDto } from '../dto/response/transaction-updated.dto';
import { TransactionFindeddDto } from '../dto/response/transaction-finded.dto';

@Injectable()
export class TransactionMapper {

    fromCreateTransactionDto(createTransactionDto: CreateTransactionDto) : Transaction {
        const transactionEntity = new Transaction();
        transactionEntity.accountExternalIdCredit = createTransactionDto.accountExternalIdCredit;
        transactionEntity.accountExternalIdDebit = createTransactionDto.accountExternalIdDebit;
        transactionEntity.amount = createTransactionDto.value;
        transactionEntity.tranferTypeId = createTransactionDto.tranferTypeId;

        return transactionEntity;
    }

    fromUpdateTransactionDto(updateTransactionDto: UpdateTransactionDto) : Transaction {
        const transactionEntity = new Transaction();
        transactionEntity.transactionExternalId = updateTransactionDto.transactionExternalId;
        transactionEntity.accountExternalIdCredit = updateTransactionDto.accountExternalIdCredit;
        transactionEntity.accountExternalIdDebit = updateTransactionDto.accountExternalIdDebit;
        transactionEntity.amount = updateTransactionDto.value;
        transactionEntity.tranferTypeId = updateTransactionDto.tranferTypeId;
        transactionEntity.status = updateTransactionDto.status;

        return transactionEntity;
    }

    toTransactionCreatedDto(transaction: Transaction) : TransactionCreatedDto {

        return {...transaction};
    }

    toTransactionUpdatedDto(transaction: Transaction) : TransactionUpdatedDto {

        return {...transaction};
    }

    toTransactionFindedDto(transaction: Transaction) : TransactionFindeddDto {

        return {...transaction};
    }

}
