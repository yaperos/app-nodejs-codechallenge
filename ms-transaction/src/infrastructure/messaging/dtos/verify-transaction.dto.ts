import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyTransactionDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  readonly externalId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;
}
