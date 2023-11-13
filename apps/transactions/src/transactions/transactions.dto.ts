import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class DataTransactionCreateDTO {
  @IsNotEmpty({ message: 'type required' })
  @IsString()
  tranferTypeId: string;

  @IsNotEmpty({ message: 'value required' })
  @IsInt()
  value: number;

  accountExternalIdDebit?: string;

  accountExternalIdCredit?: string;
}

export class DataUpdateTransactionDTO {
  status: number;
  value: number;
  transactionExternalId: string;
}
