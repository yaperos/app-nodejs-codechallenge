import { Entity, PrimaryGeneratedColumn, Column, Index, CreateDateColumn, UpdateDateColumn, Generated } from "typeorm"
import { ITransaction, ITxnInput, TxnStatus } from "@common-txn/domain"
import { DateValueTransformer, MoneyValueTransformer } from "../transformer"

@Entity()
@Index(['transactionExternalId'], { unique: true })
export class Transaction 
  implements Pick<ITransaction, "transactionExternalId"|"transactionStatus"|"transactionTypeId"|"value"|"createdAt">,
  Pick<ITxnInput, "accountExternalIdDebit"|"accountExternalIdCredit"|"transactionTypeId"|"value">{

  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  @Generated("uuid")
  transactionExternalId: string

  @Column({
    type: "enum",
    enum: TxnStatus,
    default: TxnStatus.PENDING
  })
  transactionStatus: TxnStatus

  @Column({ type: "int"})
  transactionTypeId: number

  @Column({ type: "uuid" })
  accountExternalIdDebit: string

  @Column({ type: "uuid" })
  accountExternalIdCredit: string

  @Column({
    type: "money",
    transformer: new MoneyValueTransformer()
  })
  value: number

  @CreateDateColumn({
    type: "timestamp",
    transformer: new DateValueTransformer()
  })
  createdAt: string

  @UpdateDateColumn({
    type: "timestamp",
    transformer: new DateValueTransformer()
  })
  updatedAt: string

}