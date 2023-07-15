import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDTO {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdDebit: string;
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly accountExternalIdCredit: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly transferTypeId: number;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
