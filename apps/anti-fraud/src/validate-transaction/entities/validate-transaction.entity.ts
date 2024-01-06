import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LogValidateTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  transactionExternalId: string;

  @Column({ type: 'int' })
  maximumValue?: number;

  @Column({ type: 'int' })
  value?: number;

  @Column({ type: 'int' })
  status?: number;

  @CreateDateColumn({ type: 'datetime', nullable: false })
  createdAt: Date;

  @BeforeInsert()
  asignarFechaActual(): void {
    this.createdAt = new Date();
  }
}
