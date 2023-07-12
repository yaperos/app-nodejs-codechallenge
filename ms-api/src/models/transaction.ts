import { Model } from './model';

export class Transaction extends Model {
  public static STATUS_PENDING = 'pending';
  public static STATUS_APPROVED = 'approved';
  public static STATUS_REJECTED = 'rejected';

  public transactionExternalId: string;
  public transactionType: {
    name: string;
  };
  public transactionStatus: {
    name: string;
  };
  public createdAt: string;
  public value: number;
}