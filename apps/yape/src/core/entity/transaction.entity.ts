import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./base.entity";
import { STATE_PENDING } from "../common/constant";
import { TransactionTypeEntity } from "./transaction-type.entity";
import { TransactionStateEntity } from "./transaction-state.entity";
import { v4 as uuid } from 'uuid';

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionId: string;

    @Column()
    accountDebitId: string;

    @Column()
    accountCreditId: string;

    @Column()
    transactionTypeId: number;

    @ManyToOne(() => TransactionTypeEntity)
    @JoinColumn()
    transactionType: TransactionTypeEntity;

    @Column()
    transactionStateId: number;

    @ManyToOne(() => TransactionStateEntity)
    @JoinColumn()
    transactionState: TransactionStateEntity;

    @Column()
    amount: number;

  static parseToCreate(data: any): TransactionEntity {
    let entity = new TransactionEntity();
    entity.transactionId = uuid();
    entity.accountDebitId = data?.accountExternalIdDebit;
    entity.accountCreditId = data?.accountExternalIdCredit;
    entity.transactionType = TransactionTypeEntity.parseToEntity({ id: data?.tranferTypeId });
    entity.transactionState = TransactionStateEntity.parseToEntity({ id: STATE_PENDING });
    entity.amount = data?.value;
    return entity;
  }

}