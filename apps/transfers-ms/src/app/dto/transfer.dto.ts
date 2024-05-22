import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { ITransfer } from '../interfaces/transfer.interface';
import { Transform } from 'class-transformer';

export class TransferDto implements ITransfer {
  @IsNotEmpty()
  accountExternalIdDebit: string;
  @IsNotEmpty()
  accountExternalIdCredit: string;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  transferTypeId: number;
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  value: number;
}
