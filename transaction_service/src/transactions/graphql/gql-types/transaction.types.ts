// apps/transaction-management-service/src/transaction/graphql/gql-types/transaction.type.ts
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { TransactionStatusInfo, TransactionTypeInfo } from './transaction-types.types';

@ObjectType('Transaction') // Define el tipo principal 'Transaction' en GraphQL
export class TransactionType {
  @Field(() => ID, { description: 'Identificador único externo de la transacción' })
  transactionExternalId: string;

  // --- Campos Requeridos por tu README para la Query ---
  // Para simplificar, devolvemos los tipos anidados definidos antes.
  // Necesitarás lógica en el servicio o DTO para poblar estos objetos.
  @Field(() => TransactionTypeInfo, { description: 'Información del tipo de transacción' })
  transactionType: TransactionTypeInfo;

  @Field(() => TransactionStatusInfo, { description: 'Información del estado de la transacción' })
  transactionStatus: TransactionStatusInfo;

  @Field(() => Float, { description: 'Valor monetario de la transacción' })
  value: number;

  @Field(() => Date, { description: 'Fecha y hora de creación de la transacción' })
  createdAt: Date;

  // --- Campos Adicionales del README de Creación (opcional incluirlos aquí si se devuelven tras crear) ---
  // @Field(() => ID)
  // accountExternalIdDebit: string;

  // @Field(() => ID)
  // accountExternalIdCredit: string;

  // @Field(() => Int) // Asegúrate de importar Int si lo usas
  // transferTypeId: number;
}