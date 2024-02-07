import { TransactionInfraRepository } from 'src/shared/infrastructure/transaction.respository';
import { TransactionCreateProducerKafka } from 'src/create/infra/transaction.create.producer';
import { TransactionPostgres } from 'src/create/infra/transaction.entity';
import { PersistenceModule } from './persistence/persistence.module';
import { TransactionMongo } from 'src/create/infra/transaction.mongo';
import { GraphQlModule } from './graphql/graphql.module';
import { BrokerModule } from './broker/broker.module';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

@Module({
  exports: [TransactionInfraRepository, TransactionCreateProducerKafka],
  providers: [TransactionInfraRepository, TransactionCreateProducerKafka],
  controllers: [],
  imports: [
    GraphQlModule,
    ConfigModule,
    HealthModule,
    BrokerModule,
    PersistenceModule,
    TypeOrmModule.forFeature([TransactionPostgres], 'postgresConnection'),
    TypeOrmModule.forFeature([TransactionMongo], 'mongoConnection'),
  ],
})
export class InfrastructureModule {}
