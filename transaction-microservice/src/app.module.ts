import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { DataLoaderService } from './transaction/services/data-loader.service';
import { TransactionModule } from './transaction/transaction.module';
import { TypeOrmConfigService } from './type-orm-config-service/type-orm-config.service';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.for-yape-test.env',
      load: [configuration],
    }),
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [TransactionModule],
      useFactory: (dataloaderService: DataLoaderService) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        context: () => ({
          loaders: dataloaderService.getLoaders(),
        }),
        sortSchema: true,
        debug: true,
        playground: true,
      }),
      inject: [DataLoaderService],
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
  ],
  controllers: [AppController],
  providers: [AppService, TypeOrmConfigService],
})
export class AppModule {}
