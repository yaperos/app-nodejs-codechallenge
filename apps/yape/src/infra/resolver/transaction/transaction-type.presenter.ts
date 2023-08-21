import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionTypePresenter {

  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  static parseToPresenter(data: any): TransactionTypePresenter {
    let presenter = new TransactionTypePresenter();
    presenter.id = data?.id;
    presenter.name = data?.name;
    presenter.description = data?.description;
    return presenter;
  }

}