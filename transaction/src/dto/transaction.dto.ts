import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/common/transaction.type';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'user account for transaction debit' })
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'user account for transaction credit' })
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ description: 'Transfer type' })
  transferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Value to transfer' })
  value: number;
}

export class UpdateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ description: 'user account for transaction debit' })
  transactionExternalId: string;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  @ApiProperty({ description: 'user account for transaction debit' })
  status: TransactionStatus;
}
