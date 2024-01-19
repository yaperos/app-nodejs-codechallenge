import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { grpcTransactionConfigFactory } from 'src/config/services/grpc/grpc-transaction.config';
import { GrpcTransactionFactory } from 'src/config/services/grpc/grpc-transaction.factory';

import { UseCases } from '../application/use-cases';
import { Controllers } from './controllers';
import { Providers } from './providers';
import { Resolvers } from './resolvers';
import { TRANSACTION_SERVICE_NAME } from './resources/transaction.pb';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: TRANSACTION_SERVICE_NAME,
        imports: [ConfigModule.forFeature(grpcTransactionConfigFactory)],
        inject: [ConfigService],
        useClass: GrpcTransactionFactory,
      },
    ]),
  ],
  controllers: [...Controllers],
  providers: [...Resolvers, ...UseCases, ...Providers],
})
export class TransactionModule {}
