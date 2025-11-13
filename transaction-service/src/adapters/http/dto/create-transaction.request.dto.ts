import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsUUID } from 'class-validator';

export class CreateTransactionRequestDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  accountExternalIdDebit!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID('4')
  accountExternalIdCredit!: string;

  @ApiProperty({ type: Number, minimum: 0 })
  @IsNumber()
  @IsPositive()
  tranferTypeId!: number;

  @ApiProperty({ type: Number, minimum: 0 })
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  value!: number;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID('4')
  transactionExternalId?: string;
}
