import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AntiFraudStatus } from './anti-fraud-status.enum';

@Entity()
export class AntiFraud {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  transactionExternalId: string;

  @Column()
  status: AntiFraudStatus;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
