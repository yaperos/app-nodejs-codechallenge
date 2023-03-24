import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionSchema } from './schema/transaction.schema'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppRepository } from './app.repository';


@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://root:root@cluster0.dhsoi.mongodb.net/payments'),
    MongooseModule.forFeature([{ name: 'Transaction', schema: TransactionSchema }]),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppRepository],
})
export class AppModule {}
