import { TransactionType } from '@app/common';
import { IsEnum, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
    @IsUUID()
    accountExternalIdDebit: string;

    @IsUUID()
    accountExternalIdCredit: string;

    @IsNumber()
    @IsEnum(TransactionType)
    tranferTypeId: number;

    @IsNumber()
    @Min(0)
    value: number;
}
