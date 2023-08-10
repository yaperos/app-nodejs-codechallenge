import { Injectable } from '@nestjs/common';
import { TransactionRepository } from '../domain/repositories/transaction.repository';
import { Transaction } from '../domain/aggregates/transaction';
import { AppService } from '../app.service';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionDto } from './dtos/transaction.dto';

@Injectable()
export class TransactionInfrastructure implements TransactionRepository {
  async save(transaction: Transaction): Promise<Transaction> {
    // Convertir el objeto de dominio a entidad
    const transactionEntity = TransactionDto.fromDomainToEntity(transaction);

    // Guardar la entidad en la base de datos
    const transactionSaved = await AppService.manager
      .getRepository(TransactionEntity)
      .save(transactionEntity);

    // Convertir la entidad guardada de nuevo a objeto de dominio
    const transactionDomain = TransactionDto.fromEntityToDomain(transactionSaved);

    console.log(transactionDomain, ' transactin domain');
    return transactionDomain;
  }

  async findById(transactionExternalId: string): Promise<Transaction> {
    // Buscar la entidad por el ID externo de transacción
    const transactionEntity = await AppService.manager
      .getRepository(TransactionEntity)
      .findOne({ where: { transactionExternalId } });

    // Convertir la entidad encontrada a objeto de dominio
    return TransactionDto.fromEntityToDomain(transactionEntity);
  }
}
