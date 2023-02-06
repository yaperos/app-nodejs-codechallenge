import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transactions {
  @PrimaryGeneratedColumn()
  transactionId;

  @Column({type: 'varchar', length:50})
  accountExternalIdDebit;

  @Column({type: 'varchar', length:50})
  accountExternalIdCredit;

  @Column({type: 'smallint'})
  tranferTypeId;

  @Column({type: 'float8'})
  amount;
}
