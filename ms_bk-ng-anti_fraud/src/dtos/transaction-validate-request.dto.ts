import { IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TransferTypeDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class StatusDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}

export class TransactionValidateRequestDto {
  @IsString()
  id: string;

  @IsNumber()
  value: number;

  @Type(() => TransferTypeDto)
  transferType: TransferTypeDto;

  @Type(() => StatusDto)
  status: StatusDto;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}
