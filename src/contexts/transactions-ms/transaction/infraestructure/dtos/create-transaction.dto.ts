import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { Transaction } from '../../domain/transaction.model';

export class CreateTransactionDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdDebit: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdCredit: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    tranferTypeId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    value: number;
}
