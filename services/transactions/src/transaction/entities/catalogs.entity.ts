import { Column, Entity, PrimaryColumn } from 'typeorm';


@Entity()
export class TransferType {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'transfer_type_name' })
  transferTypeName: string;

  @Column({ name: 'active' })
  active: boolean;
}

@Entity()
export class TransactionStatus {
  @PrimaryColumn({ name: 'id' })
  id: number;

  @Column({ name: 'transaction_status_name' })
  transactionStatusName: string;

  @Column({ name: 'active' })
  active: boolean;
}