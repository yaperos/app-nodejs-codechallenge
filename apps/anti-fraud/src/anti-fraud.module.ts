import { Module } from '@nestjs/common';
import { AntiFraudController } from './anti-fraud.controller';
import { AntiFraudService } from './anti-fraud.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(
      {
        isGlobal : true,
        envFilePath : '.env'
      }
    ),
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: process.env.KAFKA_BROKERS.split(','),
          },
          consumer: {
            groupId: 'anti-fraud-consumer-2',
          },
          producer : {
            allowAutoTopicCreation: true,
            createPartitioner: Partitioners.LegacyPartitioner, 
          }
        }
      }
    ]),
  ],
  controllers: [AntiFraudController],
  providers: [AntiFraudService],
})
export class AntiFraudModule {}
