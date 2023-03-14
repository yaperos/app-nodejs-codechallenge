import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionCreateDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  tranferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  value: number;
}
