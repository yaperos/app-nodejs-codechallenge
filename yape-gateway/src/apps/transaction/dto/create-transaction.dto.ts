import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  
  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @ApiProperty()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tranferTypeId: number;
  
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  value: number;
}
