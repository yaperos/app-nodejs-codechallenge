import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction } from './entity/transaction.entity';
import { TransactionService } from './services/transaction.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TransactionResolver } from './resolvers/transaction.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    ConfigModule.forRoot({
      //envFilePath: '.env',
      load: [configuration],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      driver: ApolloDriver,
    }),

    ClientsModule.register([
      {
        name: 'ANTI_FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.db'),
        synchronize: configService.get('environment') !== 'production',
        retryDelay: 3000,
        retryAttempts: 10,
        autoLoadEntities: true,
      }),
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionResolver],
})
export class AppModule {
  constructor() {
    console.log(__dirname);
  }
}
