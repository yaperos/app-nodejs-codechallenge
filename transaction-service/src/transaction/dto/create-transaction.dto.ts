import { IsUUID, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty()
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty()
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty()
  @IsNumber()
  transferTypeId: number;

  @ApiProperty()
  @IsNumber()
  value: number;
}
