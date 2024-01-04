import { Field, ObjectType, InputType, Int } from "type-graphql"
import { TxnStatus, ITxnInput, ITransaction } from "@common-txn/domain"

@ObjectType()
export class TxnResponse implements Pick<ITransaction, "transactionExternalId"|"transactionStatus"|"transactionTypeId"|"value"|"createdAt"> {
  @Field()
  transactionExternalId!: string
  @Field()
  transactionStatus!: TxnStatus
  @Field(() => Int)
  transactionTypeId!: number
  @Field()
  value!: number
  @Field()
  createdAt!: string

  constructor (itxn: ITransaction) {
    this.transactionExternalId = itxn.transactionExternalId
    this.transactionStatus = itxn.transactionStatus
    this.transactionTypeId = itxn.transactionTypeId
    this.value = itxn.value
    this.createdAt = itxn.createdAt
  }
}

@InputType()
export class TxnInput implements Pick<ITxnInput, "accountExternalIdDebit"|"accountExternalIdCredit"|"transactionTypeId"|"value"> {
  @Field()
  accountExternalIdDebit!: string
  @Field()
  accountExternalIdCredit!: string
  @Field(() => Int)
  transactionTypeId!: number
  @Field()
  value!: number
}