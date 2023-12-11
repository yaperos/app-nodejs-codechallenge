import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './entities/transaction.entity';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://db:27017/transactions'),
    MongooseModule.forFeature([
      {
        name: 'Transaction',
        schema: TransactionSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'VALIDATION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'validation',
            brokers: ['kafka:9092'],
          },
          consumer: {
            groupId: 'validation-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
