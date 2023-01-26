import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { ClientsModule } from '@nestjs/microservices/module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DBProvider } from './DBProvider';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    ClientsModule.register([
       {
        name: 'TRANSACTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction',
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId: 'transaction-consumer',
          },
        },
       }

    ]),
  ],
  controllers: [AppController],
  providers: [DBProvider,AppService],
})
export class AppModule {}
