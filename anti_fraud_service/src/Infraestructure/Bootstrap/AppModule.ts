import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AntiFraudService } from '../../Application/Services/AntiFrauddService';
import {
  ConsumerKafkaRepository,
  ProducerKafkaRepository,
  AdminKafkaRepository,
  TransactionRepository,
} from '../Repository';
import {
  AdminKafkaDomainService,
  ConsumerDomainKafkaService,
  ProducerKafkaDomainService,
  TransactionDomainService,
} from '../../Domain/Services';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
  ],
  controllers: [],
  providers: [
    AdminKafkaDomainService,
    ConsumerDomainKafkaService,
    ProducerKafkaDomainService,
    TransactionDomainService,
    {
      provide: 'ConsumerKafkaInterfaceRepository',
      useClass: ConsumerKafkaRepository,
    },
    {
      provide: 'ProducerKafkaInterfaceRepository',
      useClass: ProducerKafkaRepository,
    },
    {
      provide: 'AdminKafkaInterfaceRepository',
      useClass: AdminKafkaRepository,
    },
    {
      provide: 'TransactionInterfaceRepository',
      useClass: TransactionRepository,
    },
    AntiFraudService,
  ],
})
export class AppModule {}
