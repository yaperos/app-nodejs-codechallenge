import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from '../create.transaction.command';
import { TransactionRepository } from 'src/transaction/infraestructures/repositories/transaction.repository';
import { TransactionFactory } from 'src/transaction/domains/factory/transaction.factory';
import { TransactionEntity } from 'src/transaction/infraestructures/entities/transaction.entity';


@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler implements ICommandHandler<CreateTransactionCommand,TransactionEntity>
{
    @Inject() private readonly transactionFactory: TransactionFactory;
    @Inject() private readonly transactionRepository: TransactionRepository;
    
    async execute(command: CreateTransactionCommand): Promise<TransactionEntity> {
        const transaction = this.transactionFactory.create({...command});
        transaction.crear();
        const entidad = await this.transactionRepository.createTransaction(transaction);        
        transaction.commit();
        return entidad;
    }
    
}