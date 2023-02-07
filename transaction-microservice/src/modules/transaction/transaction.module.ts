import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'FRAUD_DETECTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fraud-detection',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'fraud-detection-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
