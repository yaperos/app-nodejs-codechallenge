import { AccountExternalNameEnum } from 'apps/api-gateway/src/transactions/enums/account-external.enum';
import { TransferNameEnum } from 'apps/api-gateway/src/transactions/enums/transfer-name.enum';

export class CreateTransactionDto {
  readonly amount: number;
  readonly accountExternalName: AccountExternalNameEnum;
  readonly transferName: TransferNameEnum;
}
