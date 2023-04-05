import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryColumn()
  id: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column({ type: 'int' })
  tranferTypeId: number;

  @Column()
  status: number;

  @Column({ type: 'int' })
  value: number;

  @Column()
  createdAt: Date;
}
