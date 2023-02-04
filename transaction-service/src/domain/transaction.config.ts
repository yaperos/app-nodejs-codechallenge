import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionConfig {
  public readonly TRANSACTION_NOT_FOUND = 'No transaction found with the ID';
  public readonly TRANSFER_TYPE_NOT_FOUND =
    'No transfer type found with the ID';
}
