import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly status: string;
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;
}
