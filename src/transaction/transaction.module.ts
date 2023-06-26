import { Module } from '@nestjs/common';
import { TransactionResolver } from './transaction.resolver';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entity/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [
    TransactionResolver, 
    TransactionService
  ],
  imports:[
    TypeOrmModule.forFeature([ Transaction ]),
    ClientsModule.register([
      {
        name: 'KAFKA',
        transport: Transport.KAFKA,
        options: {
          consumer: {
            groupId: 'kafka-consumer',
          },
          client: {
            brokers: ['pkc-ymrq7.us-east-2.aws.confluent.cloud:9092'],
            ssl: true,
            sasl: {
              mechanism: 'plain',
              username: 'JOEYP22BDKQ4GLKI',
              password: 'VNZMmXdNQaAVs0tvFpkJy2KW4fourFbpT5KH60JSK1Y0A6pfY60nIsK/Ec0/GbWx'
            }
            
          },
        }
      },
    ]),
  ],
  controllers: [TransactionController]
})
export class TransactionModule {}
