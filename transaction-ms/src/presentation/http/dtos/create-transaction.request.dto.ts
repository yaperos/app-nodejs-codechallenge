import { IsIn, IsInt, IsNumber, IsPositive, IsUUID } from 'class-validator';
import { TRANSFER_TYPE_IDS } from '../../../domain/value-objects/transfer-type';

export class CreateTransactionRequestDto {
    @IsUUID()
    accountExternalIdDebit!: string;

    @IsUUID()
    accountExternalIdCredit!: string;

    @IsInt()
    @IsIn(TRANSFER_TYPE_IDS)
    tranferTypeId!: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @IsPositive()
    value!: number;
}