import { TransactionType, TransactionStatus } from '@core/entities';
import { StatusResponse } from '@core/config/constants';
import { PageMetaDto } from '@core/types/pagination';

export type CreateTransactionResponseDto = {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  id: number;
  createdAt: Date;
};

export type TransactionDataResponse = {
  transactionExternalId: string;
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  value: number;
  amount?: number;
  createdAt: Date;
};

export type ServerResponse<T> = {
  message: string;
  status: TransactionResponseStatus;
  data: T | undefined | null;
};

export type ServerPaginateResponse<T> = {
  message: string;
  status: TransactionResponseStatus;
  data: T | undefined | null;
  meta: PageMetaDto;
};

export type TransactionResponseStatus =
  | StatusResponse.OK
  | StatusResponse.ERROR;
