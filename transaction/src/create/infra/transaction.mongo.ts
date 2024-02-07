import { TransactionStatus } from 'src/shared/domain/transaction.model';
import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity({ name: 'transaction' })
export class TransactionMongo {
  // Esto puede bajar un poco el rendimiento pero es el requerimiento.
  @ObjectIdColumn()
  _id: string;

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
