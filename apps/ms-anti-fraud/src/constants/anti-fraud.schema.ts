import { StateTransaction } from '../enums/anti-fraud-state.enums';
import { VALUE_MAX_TRANSACTION } from './common';

export const transactionResolvedSchema = {
  requestId: 'requestId',
  value: {
    key: 'status',
    transform: (value: number) =>
      value > VALUE_MAX_TRANSACTION
        ? StateTransaction.REJECTED
        : StateTransaction.APPROVED,
  },
};
