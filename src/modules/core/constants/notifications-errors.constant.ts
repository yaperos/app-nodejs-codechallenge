import { NotificationsErrorKeys } from '../enums/exception-keys.enum';

export const NOTIFICATIONS_ERRORS = {
  [NotificationsErrorKeys.TRANSACTION_VALUE]: {
    message: 'Transaction error in value',
    httpStatusCode: 403,
  },
};
