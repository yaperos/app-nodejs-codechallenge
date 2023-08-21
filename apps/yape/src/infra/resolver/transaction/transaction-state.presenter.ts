import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TransactionStatePresenter {

  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  static parseToPresenter(data: any): TransactionStatePresenter {
    let presenter = new TransactionStatePresenter();
    presenter.id = data?.id;
    presenter.name = data?.name;
    presenter.description = data?.description;
    return presenter;
  }

}