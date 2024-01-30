import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateStatusTransactionDto {
  @IsString()
  @IsNotEmpty()
  StatusTransactionId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}
