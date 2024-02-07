import { TransactionStatus } from 'src/shared/domain/transaction.model';
import { Entity, ObjectId, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionMongo {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  transactionId: string;

  @Column()
  transactionType: { name: string };

  @Column()
  transactionStatus: { name: TransactionStatus };

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  value: number;

  @Column()
  createdAt: Date;

  @Column()
  updateAt?: Date;
}
