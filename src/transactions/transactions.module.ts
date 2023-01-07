import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/typeorm/transaction.entity';
import { TransactionsController } from './controllers/transactions/transactions.controller';
import { TransactionsService } from './services/transactions/transactions.service';

@Module({
  imports:[
    TypeOrmModule.forFeature([Transaction]),
    ClientsModule.register([
      {
        name:'challenger-client',
        transport:Transport.KAFKA,
        options:{
          
          client:{
            brokers:['localhost:9092']
          }
        }

      }
    ])
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionsModule {}
