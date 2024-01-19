import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, } from 'typeorm';
  
  @Entity({ name: 'transactions' })
  export class TransactionEntity {
    @PrimaryGeneratedColumn('uuid')
    transactionExternalId: string;
  
    @Column({type: 'uuid', length: 20 })
    accountExternalIdDebit: string;
  
    @Column({type: 'uuid', length: 20 })
    accountExternalIdCredit: string;
  
    @Column('int')
    transferTypeId: number;
  
    @Column('float')
    value: number;
  
    @Column('int')
    status: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  }
  