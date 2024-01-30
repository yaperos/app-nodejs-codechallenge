import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDate,
    IsNumber,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class TransactionBase {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    tranferTypeId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    value: number;

    constructor(partial: Partial<Transaction>) {
        Object.assign(this, partial);
    }
}

export class Transaction extends TransactionBase {
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
}

export class CreateTransaction extends PartialType(Transaction) { }

export class UpdateTransaction extends PartialType(TransactionBase) { }
