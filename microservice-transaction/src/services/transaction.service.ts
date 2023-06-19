import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus} from '@nestjs/cqrs';
import { CreateTransactionCommand } from 'src/operations/commands/create/create.transaction.command';
import { TransactionCreateDTO } from 'src/dtos/transaction.create.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionReadDTO } from 'src/dtos/transaction.read.dto';
import { GetTransactionQuery } from 'src/operations/queries/get/get.transaction.query';
import { TransactionUpdateDTO } from 'src/dtos/transaction.update.dto';
import { UpdateTransactionCommand } from 'src/operations/commands/update/update.transaction.command';


@Injectable()
export class TransactionService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @InjectMapper() private readonly classMapper: Mapper,
    ) {}
  
  async create(data: TransactionCreateDTO) {
    const command = this.classMapper.map(data, TransactionCreateDTO, CreateTransactionCommand);
    return this.classMapper.mapAsync(
      await this.commandBus.execute(command), 
      Transaction, 
      TransactionReadDTO
    );
  }

  async updateStatus(data: TransactionUpdateDTO) {
    return this.classMapper.mapAsync(
      await this.commandBus.execute(
        new UpdateTransactionCommand(data.transactionExternalId, data.status)),
      Transaction,
      TransactionReadDTO)
  }

  async getById(transactionExternalId: string){
    return this.classMapper.mapAsync(
      await this.queryBus.execute(
        new GetTransactionQuery(transactionExternalId)
      ), 
      Transaction,
      TransactionReadDTO
    );
  }
}