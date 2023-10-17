import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTransactionRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '123123' })
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '32132131' })
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([1])
  @ApiProperty({ example: 1 })
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1000 })
  value: number;
}
