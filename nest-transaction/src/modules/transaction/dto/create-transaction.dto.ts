import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @IsPositive()
  @ApiProperty()
  tranferTypeId: number;

  @IsNumber()
  @IsPositive()
  @ApiProperty()
  value: number;
}
