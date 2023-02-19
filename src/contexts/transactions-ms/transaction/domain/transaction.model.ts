import { Expose } from 'class-transformer';
import { v4 as uuid } from 'uuid';

import { CreateTransactionDto } from '../infraestructure/dtos/create-transaction.dto';

export class Transaction {
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
    status: string;

    public static fromCreateDto(dto: CreateTransactionDto): Transaction {
        return {
            id: uuid(),
            accountExternalIdCredit: dto.accountExternalIdCredit,
            accountExternalIdDebit: dto.accountExternalIdDebit,
            tranferTypeId: dto.tranferTypeId,
            value: dto.value,
            status: 'Pending',
        };
    }
}
