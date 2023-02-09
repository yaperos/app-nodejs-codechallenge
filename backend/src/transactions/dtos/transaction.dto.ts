import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTransactionDto {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly accountExternalIdDebit: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  readonly accountExternalIdCredit: string;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly tranferTypeId: number;
  
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly value: number;
}