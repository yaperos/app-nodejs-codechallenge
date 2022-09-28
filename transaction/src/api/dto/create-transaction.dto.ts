import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength, IsNotEmpty, validate, Contains } from 'class-validator';
import { TRANFER_TYPE } from 'src/domain/transaction.tranfer.type.id';

export class CreateTransactionBodyDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({ minLength: 1, example: 'Guid' })
  readonly accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty({ minLength: 1, example: 'Guid' })
  readonly accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ minLength: 1, example: 1 })
  readonly tranferTypeId: TRANFER_TYPE;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ minLength: 1, example: 20 })
  readonly value: number;
}

