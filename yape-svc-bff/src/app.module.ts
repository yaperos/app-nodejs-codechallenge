import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

/* Internal */
import { join } from 'path';

/* Project */
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BaseResolver } from './common/graphql/base.resolver';
import { TransactionResolver } from './cases/transactions';
import { TransactionProto } from './constants/grpc.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule],
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          playground: process.env.NODE_ENV !== 'production',
          path: `${configService.get('API_PREFIX')}/graphql`,
          formatError: (error) => {
            return {
              message: error.message,
              code: error.extensions?.code,
              grpcCode: error.extensions?.grpcCode,
              grpcStatus: error.extensions?.grpcStatus,
              meta: error.extensions?.meta,
            };
          },
        };
      },
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          imports: [ConfigModule],
          name: TransactionProto.service,
          useFactory: (configService: ConfigService) => {
            return {
              transport: Transport.GRPC,
              options: {
                package: TransactionProto.proto.package,
                protoPath: join(
                  process.cwd(),
                  TransactionProto.proto.protoPath,
                ),
                url: configService.get<string>('TRANSACTION_MS_URL'),
              },
            };
          },
          inject: [ConfigService],
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [BaseResolver, TransactionResolver, AppService],
})
export class AppModule {}
