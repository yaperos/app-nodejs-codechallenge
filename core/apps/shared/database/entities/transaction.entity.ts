import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  accountExternalIdDebit: string;

  @Column({
    nullable: false,
    default: '',
  })
  accountExternalIdCredit: string;

  @Column({
    nullable: true,
  })
  tranferTypeId: number;


  @Column({
    nullable: false,
    default: '',
  })
  transactionType: string;

  @Column({
    nullable: false,
    default: '',
  })
  transactionStatus: string;

  @Column({
    nullable: true,
  })
  value: number;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}