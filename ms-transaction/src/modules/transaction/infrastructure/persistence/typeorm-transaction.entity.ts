import { AwareColumn } from 'src/modules/shared/infrastructure/persistence/typeorm/typeorm-aware-column.decorator';
import { TransferType } from 'src/modules/transaction/domain/transaction-transfer-type';
import { ValidationStatus } from 'src/modules/transaction/domain/transaction-validation-status';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'transaction' })
export class TypeOrmTransactionEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @Column({
    name: 'credit_account_external_id',
    type: 'uuid',
  })
  creditAccountExternalId: string;

  @Column({
    name: 'debit_account_external_id',
    type: 'uuid',
  })
  debitAccountExternalId: string;

  @Column({
    type: 'float',
  })
  amount: number;

  @AwareColumn({
    name: 'transfer_type',
    type: 'enum',
    enum: TransferType,
  })
  transferType: TransferType;

  @AwareColumn({
    name: 'validation_type',
    type: 'enum',
    enum: ValidationStatus,
  })
  validationStatus: ValidationStatus;

  @Index()
  @AwareColumn({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @AwareColumn({
    name: 'updated_at',
    type: 'timestamp',
  })
  updatedAt: Date;
}
