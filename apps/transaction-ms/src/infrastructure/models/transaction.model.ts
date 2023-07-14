import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { TransferTypeModel } from './transfer-type.model';
import { TransactionEntity } from '../../domain/entities/transaction.entity';
import { TransactionStatusEnum } from '../../domain/enums/transaction.enum';

@Entity({ name: 'transactions' })
export class TransactionModel {
  @PrimaryColumn({
    unique: true,
    type: 'uuid',
  })
  transactionExternalId: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  accountExternalIdDebit: string;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  accountExternalIdCredit: string;

  @Column({
    type: 'float',
    nullable: false,
  })
  value: number;

  @Column({
    nullable: false,
  })
  transactionStatus: string;

  @ManyToOne(() => TransferTypeModel)
  transferType: TransferTypeModel;

  @Column({
    nullable: false,
  })
  createdAt: Date;

  static fromEntity(entity: TransactionEntity): TransactionModel {
    const model = new TransactionModel();
    model.transactionExternalId = entity.transactionExternalId;
    model.accountExternalIdDebit = entity.accountExternalIdDebit;
    model.accountExternalIdCredit = entity.accountExternalIdCredit;
    model.value = entity.value;
    model.transactionStatus = entity.transactionStatus;
    model.transferType = TransferTypeModel.fromEntity(entity.transferType);
    model.createdAt = entity.createdAt;
    return model;
  }

  toEntity(): TransactionEntity {
    const transferType = this.transferType.toEntity();
    return new TransactionEntity(
      this.transactionExternalId,
      this.accountExternalIdDebit,
      this.accountExternalIdCredit,
      this.value,
      TransactionStatusEnum[this.transactionStatus],
      transferType,
      this.createdAt,
    );
  }
}
