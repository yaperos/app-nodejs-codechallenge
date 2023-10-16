import { IsNumber, IsUUID } from 'class-validator';
import { TransactionType } from '../../../../../../constants/transaction';
import { TransactionStatusEnum } from '../../../../../../constants/antifraud';

export class TransactionRequestDto {
  @IsUUID()
  accountExternalIdDebit: string;

  @IsUUID()
  accountExternalIdCredit: string;

  @IsNumber()
  tranferTypeId: TransactionType;

  @IsNumber()
  value: number;
}

export class TransactionResponse {
  transactionExternalId: string;
  transactionType: TransactionTypeResponse;
  transactionStatus: TransactionStatusResponse;
  value: number;
  createdAt: Date;
}

export class TransactionTypeResponse {
  name: string;
}

export class TransactionStatusResponse {
  name: string;
}

export class TransactionValidatedDto {
  @IsUUID()
  transactionId: string;

  @IsNumber()
  status: TransactionStatusEnum;
}
