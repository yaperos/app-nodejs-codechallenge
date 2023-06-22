/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { FinancialTransaction } from './entities/financial-transaction.entity';
import { ANTI_FRAUD_CONSUMER } from './constans/kakfa-topics';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([FinancialTransaction]),
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-microservice',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: ANTI_FRAUD_CONSUMER,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
