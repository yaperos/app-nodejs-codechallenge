import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('transactions')
  @Index(['transactionExternalId'], { unique: true })
  @Index(['status'])
  @Index(['createdAt'])
  export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'uuid', unique: true })
    transactionExternalId: string;
  
    @Column({ type: 'uuid' })
    accountExternalIdDebit: string;
  
    @Column({ type: 'uuid' })
    accountExternalIdCredit: string;
  
    @Column({ type: 'int' })
    transferTypeId: number;
  
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    value: number;
  
    @Column({
      type: 'varchar',
      length: 20,
      default: 'pending',
    })
    status: 'pending' | 'approved' | 'rejected';
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column({ type: 'text', nullable: true })
    rejectionReason: string;
  
    generateTransactionExternalId() {
      this.transactionExternalId = require('uuid').v4();
    }
  }