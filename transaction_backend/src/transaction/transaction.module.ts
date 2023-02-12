import {Module} from '@nestjs/common';
import {TransactionService} from './transaction.service';
import {TransactionController} from './transaction.controller';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Transaction} from './entities';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'ANTI_FRAUD',
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'anti_fraud',
          brokers: ['localhost:9092'],
        },
        consumer: {
          groupId: 'anti_fraud_consumer'
        }
      }
    }]),
    TypeOrmModule.forFeature([Transaction])
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
