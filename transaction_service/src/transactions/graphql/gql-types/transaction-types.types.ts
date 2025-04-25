
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class TransactionTypeInfo {
  @Field(() => String, { description: 'Nombre descriptivo del tipo de transferencia' })
  name: string;
}

@ObjectType()
export class TransactionStatusInfo {
  @Field(() => String, { description: 'Nombre del estado de la transacción (pending, approved, rejected)' })
  name: string;
}
