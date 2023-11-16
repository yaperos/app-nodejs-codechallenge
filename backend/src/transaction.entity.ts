import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId: string;

  @Column()
  accountExternalIdDebit: string;

  @Column()
  accountExternalIdCredit: string;

  @Column()
  tranferTypeId: number;

  @Column()
  value: number;

  @Column({ default: 'pending' }) 
  transactionStatus: string;

  @CreateDateColumn()
  createdAt: Date;

  async updateTransactionStatus(newStatus: string): Promise<void> {
    this.transactionStatus = newStatus;
    await this.save(); 
  }
}