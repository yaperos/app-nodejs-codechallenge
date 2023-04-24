import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('transaction')
export class Transaction {
  @Column({ type: 'int', primary: true })
  id: number;

  @Column({ type: 'varchar', length: 36 })
  uuid: string;

  @Column({ type: 'varchar', length: 36 })
  accountexternal_id_debit: string;

  @Column({ type: 'varchar', length: 36 })
  accountexternal_id_credit: string;

  @Column({ type: 'varchar', length: 36 })
  tranfer_type: string;

  @Column({ type: 'float8' })
  value!: number;

  @Column({ type: 'varchar', length: 36 })
  status: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ type: 'timestamp' })
  update_at: Date;

  @BeforeInsert()
  async beforeInsert() {
    this.uuid = uuidv4();
    this.created_at = new Date();
    this.update_at = new Date();
  }

  @BeforeUpdate()
  async beforeUpdate() {
    this.update_at = new Date();
  }
  
}

export type IRegisterTransaction = Omit<Transaction, 'id' | 'uuid' | 'created_at' |'update_at' | 'beforeInsert' | 'beforeUpdate'>;