import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber } from 'class-validator';
export default class TransactionCommand {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ format: 'uuid' })
  accountExternalIdDebit: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ format: 'uuid' })
  accountExternalIdCredit: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  tranferTypeId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  value: number;
}
