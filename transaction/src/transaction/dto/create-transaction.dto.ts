import { IsDecimal, IsNotEmpty} from 'class-validator';

export class CreateTransactionDto {
  constructor() {
    console.log('CreateTransactionDto constructor called');
  }

  accountExternalIdDebit?: string | null;

  accountExternalIdCredit?: string | null;

  @IsNotEmpty()
  transferTypeId: number;

  @IsNotEmpty()
  value: number;
}
