import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CreateTransactionOutput {
  @Field() readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}
