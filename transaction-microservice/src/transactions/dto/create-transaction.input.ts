import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { OutputTypeFactory } from '@nestjs/graphql/dist/schema-builder/factories/output-type.factory';
import { isOutputType } from 'graphql';

// No se necesita el resto de valores porque se van a generar solos

@InputType()
export class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;
}
