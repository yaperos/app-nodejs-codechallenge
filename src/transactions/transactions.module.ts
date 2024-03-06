import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { TypeOrmModule} from '@nestjs/typeorm'
import { Transaction } from './transaction.entity';
import { Type } from '../type/type.entity';
import { Status } from '../status/status.entity';
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [ TypeOrmModule.forFeature([Transaction,Type,Status]),
      ClientsModule.register([{
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options:{
          consumer:{
            groupId:'1'
          },
          client:{
            brokers:['localhost:9092']
          }
        }
      }
      ])
    ],
  controllers: [TransactionsController],
  providers: [TransactionsService,ProducerService,ConsumerService]
})
export class TransactionsModule {}
