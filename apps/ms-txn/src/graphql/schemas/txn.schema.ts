import { Field, ObjectType, InputType, Int } from "type-graphql"

@ObjectType()
export class TxnResponse {
  @Field()
  transactionExternalId!: string
  @Field()
  value!: number
  @Field()
  createdAt!: string
}

@InputType()
export class TxnInput {
  @Field()
  accountExternalIdDebit!: string
  @Field()
  accountExternalIdCredit!: string
  @Field(() => Int)
  tranferTypeId!: number
  @Field()
  value!: number
}