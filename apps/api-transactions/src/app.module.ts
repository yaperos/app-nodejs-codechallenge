import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { TransactionStatus } from './transaction/entities/transactionStatus.entity';
import { TransactionType } from './transaction/entities/transactionType.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseConfig = configService.get('database.postgres');
        return {
          type: 'postgres',
          host: databaseConfig.host,
          port: databaseConfig.port,
          username: databaseConfig.user,
          password: databaseConfig.password,
          database: databaseConfig.database,
          entities: [Transaction, TransactionStatus, TransactionType, User],
          synchronize: true, //not use in production
        };
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: true,
      playground: true,
      include: [],
      autoSchemaFile: join(
        process.cwd(),
        'apps/api-transactions/src/schema.gql',
      ),
    }),
    TransactionModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
