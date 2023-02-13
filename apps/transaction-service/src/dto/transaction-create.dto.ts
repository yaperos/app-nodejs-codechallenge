import { IsNumber, IsString,  IsOptional } from 'class-validator';
import {
  Expose,
  Type,
} from 'class-transformer';

export class CreateTransactionReq  {
  @IsString()
  @IsOptional()
  readonly accountExternalIdDebit: string;

  @IsString()
  @IsOptional()
  readonly accountExternalIdCredit: string;

  @IsNumber()
  readonly tranferTypeId: number;

  @IsNumber()
  readonly value: number;
}


export class CreateTransactionMessageDTO  {
  @Expose()
  @Type(() => CreateTransactionReq)
  value: CreateTransactionReq;
}

