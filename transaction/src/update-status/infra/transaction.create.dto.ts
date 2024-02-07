import { TransactionCreateInput } from 'src/create/app/transaction.create.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { TransactionStatus } from 'src/shared/domain/transaction.model';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreateInputDto implements TransactionCreateInput {
  @ApiProperty({
    required: false,
    example: 'ef6990f2-7d00-43bd-880d-fbe6220f1e83',
  })
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'ef6990f2-7d00-43bd-880d-fbe6220f1e82' })
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @ApiProperty({ example: '83138fba-ada6-4478-8c75-5b9e921521dd' })
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  transactionTypeId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  value: number;
}

export class AntiFraudTransactionStatusEventDto {
  id: string;
  status: TransactionStatus;
}
