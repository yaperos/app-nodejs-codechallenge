import { IsNotEmpty, IsString, IsNumber, IsPositive, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'External ID of the debit account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @ApiProperty({
    description: 'External ID of the credit account',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @ApiProperty({
    description: 'Transfer type ID',
    example: 1,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  tranferTypeId: number;

  @ApiProperty({
    description: 'Transaction value',
    example: 120,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
} 