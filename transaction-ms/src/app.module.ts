import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { PrismaModule } from 'nestjs-prisma';
import { GqlConfigService } from './common/configs/gql-config.service';
import { loggingMiddleware } from './common/middleware/logging.middleware';

import { OperationsHandlerModule } from './common/operations-handler/operations-handler.module';
import { TransactionTypeModule } from './transaction-type/transaction-type.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: { errorFormat: 'minimal' },
        middlewares: [
            loggingMiddleware(new Logger('PrismaMiddleware')),
        ],
    },
    }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      useClass: GqlConfigService,
    }),
    OperationsHandlerModule,
    TransactionModule,
    TransactionTypeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
