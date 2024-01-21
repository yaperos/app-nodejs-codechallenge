import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class TransactionResponseDto {
  @IsString()
  transactionExternalId: string;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  transactionType: { name: number };

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  transactionStatus: { name: string };

  @IsNumber()
  value: number;

  @IsDate()
  createdAt: Date;
}
