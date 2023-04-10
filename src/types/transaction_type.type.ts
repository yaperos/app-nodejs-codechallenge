import { ObjectType, Field } from 'type-graphql';

export interface ITransactionType {
  id: number;
  name: string;
}

@ObjectType()
export class TransactionTypeObjectType implements Partial<ITransactionType> {
  @Field()
  name!: string;
}
