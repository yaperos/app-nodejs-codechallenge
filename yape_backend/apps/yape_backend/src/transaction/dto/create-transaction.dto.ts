import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  accountExternalIdCredit: string;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  tranferTypeId: number;

  @IsInt()
  @IsNotEmpty()
  @ApiProperty()
  value: number;
}
