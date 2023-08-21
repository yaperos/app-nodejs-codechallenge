import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { TransactionTypePresenter } from "./transaction-type.presenter";
import { TransactionStatePresenter } from "./transaction-state.presenter";

@ObjectType()
export class TransactionPresenter {

  @Field()
  transactionExternalId: string;

  @Field()
  transactionType: TransactionTypePresenter;

  @Field()
  transactionStatus: TransactionStatePresenter;

  @Field(() => Float)
  value: number;

  @Field()
  createdAt: Date;

  static parseToPresenter(data: any): TransactionPresenter {
    let presenter = new TransactionPresenter();
    presenter.transactionExternalId = data?.transactionId;
    presenter.transactionType = TransactionTypePresenter.parseToPresenter({ id: data?.transactionTypeId });
    presenter.transactionStatus = TransactionStatePresenter.parseToPresenter({ id: data?.transactionStateId });
    presenter.value = data?.amount;
    presenter.createdAt = data?.createdAt;
    return presenter;
  }

}