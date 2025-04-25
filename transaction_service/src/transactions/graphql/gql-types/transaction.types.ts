
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TransactionStatusInfo, TransactionTypeInfo } from './transaction-types.types';

@ObjectType('Transaction')
export class TransactionType {
  @Field(() => ID, { description: 'Identificador único externo de la transacción' })
  transactionExternalId: string;


  @Field(() => TransactionTypeInfo, { description: 'Información del tipo de transacción' })
  transactionType: TransactionTypeInfo;

  @Field(() => TransactionStatusInfo, { description: 'Información del estado de la transacción' })
  transactionStatus: TransactionStatusInfo;

  @Field(() => Float, { description: 'Valor monetario de la transacción' })
  value: number;

  @Field(() => Date, { description: 'Fecha y hora de creación de la transacción' })
  createdAt: Date;


}