import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransController } from './transaction.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionResolver } from './transaction.resolver';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TRANSACTION_MS',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transacion_group',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [TransController],
  providers: [TransactionService, TransactionResolver],
})
export class TransModule {}
