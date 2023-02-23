import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

import { TransactionType } from 'src/contexts/transactions-ms/shared/domain/enums/transaction-type.enum';

export class CreateTransactionDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdDebit: string;

    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    accountExternalIdCredit: string;

    @ApiProperty({
        enum: TransactionType,
        example: TransactionType.DEBIT,
    })
    @IsNumber()
    @IsEnum(TransactionType, {
        message: 'Invalid transaction type',
    })
    tranferTypeId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    value: number;
}
