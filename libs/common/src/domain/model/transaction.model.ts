import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDate,
    IsNumber,
    IsEnum,
} from 'class-validator';
import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';

export enum TransactionStatuses{
    PENDING= "pending",
    APPROVED= "approved",
    REJECTED= "rejected"
}

export class TransactionM {
    @ApiProperty()
    @IsString()
    _id: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountExternalIdDebit: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    accountExternalIdCredit: string;

    @ApiProperty()
    @IsOptional()
    @IsDate()
    created_at: Date;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    tranferTypeId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    value: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(TransactionStatuses, { message: 'Invalid transaction status' })
    transactionStatus: TransactionStatuses

    constructor(partial: Partial<TransactionM>) {
        Object.assign(this, partial);
    }
}

export class CreateTransaction extends PickType(TransactionM, ['tranferTypeId','value'] as const) {}
export class UpdateTransaction extends PickType(TransactionM, ['transactionStatus'] as const) {}
