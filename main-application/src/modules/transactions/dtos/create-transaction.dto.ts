import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUUID, Min } from 'class-validator';
import { TransactionStatuses, TransactionTypes } from '../types/transaction-types-enums';
import { Transform } from 'class-transformer';
import { toNumber } from 'lodash';

export class CreateTransactionDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdDebit: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    accountExternalIdCredit: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TransactionTypes)
    transferTypeId: TransactionTypes;
    
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    value: number;
}