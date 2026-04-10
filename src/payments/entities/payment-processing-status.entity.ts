import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_processing_status')
export class PaymentProcessingStatusEntity {
  @PrimaryColumn('uuid', { name: 'payment_id' })
  paymentId: string;

  @Column({ name: 'fraud_status', type: 'varchar', length: 16, default: 'pending' })
  fraudStatus: string;

  @Column({ name: 'ledger_status', type: 'varchar', length: 16, default: 'pending' })
  ledgerStatus: string;

  @Column({ name: 'final_status', type: 'varchar', length: 16, default: 'pending' })
  finalStatus: string;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
