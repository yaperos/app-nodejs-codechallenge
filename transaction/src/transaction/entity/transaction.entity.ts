import { AuditEntity } from "./audit-entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TransactionTypeEntity } from "./transaction-type.entity";
import { TransactionStatusEnum } from "../dto/TransactionStatus.enum";

@Entity({name:TransactionEntity.TABLE_NAME })
export class TransactionEntity extends AuditEntity{

  private static TABLE_NAME  : string = 'transaction';

  @PrimaryGeneratedColumn("uuid", { name: 'id' })
  transactionExternalId: string;

  @Column({ name: 'account_external_id_debit', type: 'varchar', length: 200, nullable: false })
  accountExternalIdDebit: string;

  @Column({ name: 'account_external_id_credit', type: 'varchar', length: 200, nullable: false })
  accountExternalIdCredit: string;

  @Column({ nullable: false , type:"numeric"})
  value: number;

  @ManyToOne(() => TransactionTypeEntity, type => type.id, { eager: true })
  @JoinColumn({ name: 'transaction_type_id', referencedColumnName: 'id', foreignKeyConstraintName: 'transaction_type_id' })
  transactionType: TransactionTypeEntity;

  @Column({ type: "enum", enum:TransactionStatusEnum, default: TransactionStatusEnum.PENDING })
  transactionStatus: TransactionStatusEnum;
}