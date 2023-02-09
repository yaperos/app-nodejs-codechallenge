import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TransactionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity()
export class Transaction {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accountExternalIdDebit: string;
  
  @Column()
  accountExternalIdCredit: string;
  
  @Column()
  tranferTypeId: number;
  
  @Column()
  value: number;
  
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
