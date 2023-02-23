import { Expose, plainToInstance } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { TransactionStatus } from '../../shared/domain/enums/transaction-status.enum';
import {
    TransactionType,
    TransactionTypeName,
} from '../../shared/domain/enums/transaction-type.enum';
import { CreateTransactionDto } from '../infraestructure/dtos/create-transaction.dto';

export class TransactionModel {
    @Expose()
    id: string;
    @Expose()
    accountExternalIdDebit: string;
    @Expose()
    accountExternalIdCredit: string;
    @Expose()
    tranferTypeId: number;
    @Expose()
    value: number;
    @Expose()
    status: TransactionStatus;
    @Expose()
    createdAt: Date;

    public get transactionTypeName(): string {
        if (this.tranferTypeId === TransactionType.DEBIT) {
            return TransactionTypeName.DEBIT;
        }
        if (this.tranferTypeId === TransactionType.CREDIT) {
            return TransactionTypeName.CREDIT;
        }
        return null;
    }

    public static fromCreateDto(dto: CreateTransactionDto): TransactionModel {
        const transaction = {
            id: uuid(),
            accountExternalIdCredit: dto.accountExternalIdCredit,
            accountExternalIdDebit: dto.accountExternalIdDebit,
            tranferTypeId: dto.tranferTypeId,
            value: dto.value,
            status: TransactionStatus.PENDING,
            createdAt: new Date(),
        };
        return plainToInstance(TransactionModel, transaction);
    }
}
