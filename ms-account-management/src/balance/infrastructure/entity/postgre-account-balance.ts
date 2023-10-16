import { AccountBalance } from 'src/balance/domain/entity/account-balance';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'account_balance' })
export class PostgreAccountBalance implements AccountBalance {
  @PrimaryGeneratedColumn('uuid')
  public accountBalanceId: string;

  @Column({ type: 'uuid', unique: true })
  public userId: string;

  @Column({ type: 'double precision', default: 0 })
  public amount: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
