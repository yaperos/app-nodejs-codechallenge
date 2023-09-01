import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateTransactionCommandHandler } from 'src/transaction/applications/commands/Handlers/create.transaction.command.handler';
import { TransactionFactory } from 'src/transaction/domains/factory/transaction.factory';
import { TransactionRepository } from 'src/transaction/infraestructures/repositories/transaction.repository';
import { CreateTransactionEventHandler } from 'src/transaction/applications/event/create.transaction.event.handler';
import { CreateTransactionEventIntegratedHandler } from 'src/transaction/applications/eventintegrated/create.transaction.eventintegrated.handler';



const applications = 
    [ CreateTransactionCommandHandler,
      CreateTransactionEventHandler ,
      CreateTransactionEventIntegratedHandler
    ]
/* 
    ClientsModule.register([
      {
        name:'KAFKA_SERVICE',
        transport:Transport.KAFKA,
        options: {
          producer:{
            createPartitioner:Partitioners.LegacyPartitioner
          },
          client:{
            clientId: 'transaction',
            brokers: ['localhost:9092']
          },
          //producerOnlyMode:true,
          consumer: {
             groupId:'transaction-consumer'                    
          }
        }
      }
    ]), 
*/

@Module({
  imports: [CqrsModule],
  controllers: [TransactionController],
  providers: [...applications,TransactionFactory,TransactionRepository],
  
})
export class TransactionModule {}
