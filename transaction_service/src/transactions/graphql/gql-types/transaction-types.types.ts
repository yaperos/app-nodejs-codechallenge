// apps/transaction-management-service/src/transaction/graphql/gql-types/transaction-info.types.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType() // Define un tipo GraphQL anidado
export class TransactionTypeInfo {
  @Field(() => String, { description: 'Nombre descriptivo del tipo de transferencia' })
  name: string;
}

@ObjectType() // Define un tipo GraphQL anidado
export class TransactionStatusInfo {
  @Field(() => String, { description: 'Nombre del estado de la transacción (pending, approved, rejected)' })
  name: string;
}

// --- Podrías usar directamente el Enum si lo registras ---
// import { TransactionStatus } from '../../entities/transaction-status.enum';
// import { registerEnumType } from '@nestjs/graphql';
// // Registra el enum para usarlo en el schema (haz esto una vez, ej: en el transaction.module.ts)
// registerEnumType(TransactionStatus, { name: 'TransactionStatusEnum' });

// @ObjectType()
// export class TransactionStatusInfo {
//   @Field(() => TransactionStatusEnum) // Usa el enum registrado
//   name: TransactionStatus;
// }