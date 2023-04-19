import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from '../transaction.service';
import { TransactionTypeGraphql } from './tipos/transaction.type.graphql';
import { CreateTransactionWithGraphql } from '../dto/create-transaction-graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';

  /**
   * Busqueda de transacción por identificador externo
   * @param transactionExternalId Identificador externo de la transacción
   * @returns Transacción encontrada y manejo de errores
   */

@Resolver(() => TransactionTypeGraphql)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => TransactionTypeGraphql, { nullable: true })
  async findTransactionByExternalId(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<TransactionTypeGraphql> {
    try {
      const transaction = await this.transactionService.findOneByTransactionExternalIdWithGraphql(transactionExternalId);
      return transaction;
    } catch (error) {
      console.error(`Error al buscar la transaccion con ExternalId: ${transactionExternalId}. Error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Creación de nueva transacción
   * @param createTransaction Datos de la nueva transacción
   * @returns Transacción creada y manejo de errores
   */

  @Mutation(() => TransactionTypeGraphql)
  @UsePipes(new ValidationPipe())
  async createTransaction(
    @Args('CreateTransactionWithGraphql') createTransaction: CreateTransactionWithGraphql,
  ): Promise<TransactionTypeGraphql> {
    try {
      const transaction = await this.transactionService.createWithGraphql(createTransaction);
      return transaction;
    } catch (error) {
      console.error(`Error creando la transacción. Error: ${error.message}`);
      throw error;
    }
  }
}
