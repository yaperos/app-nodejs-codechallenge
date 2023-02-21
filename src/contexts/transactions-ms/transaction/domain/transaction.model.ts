import { Expose } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { TransactionStatus } from '../../shared/domain/enums/transaction-status.enum';
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

    public static fromCreateDto(dto: CreateTransactionDto): TransactionModel {
        return {
            id: uuid(),
            accountExternalIdCredit: dto.accountExternalIdCredit,
            accountExternalIdDebit: dto.accountExternalIdDebit,
            tranferTypeId: dto.tranferTypeId,
            value: dto.value,
            status: TransactionStatus.PENDING,
        };
    }
}
