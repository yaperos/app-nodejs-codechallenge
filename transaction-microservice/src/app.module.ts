import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { DateScalar } from './helpers';
import { CacheConfigService } from './services';
import { TypeOrmConfigService } from './services/type-orm-config-service/type-orm-config.service';
import { DataLoaderService } from './transaction/services/data-loader.service';
import { TransactionModule } from './transaction/transaction.module';
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
  providers: [TypeOrmConfigService, CacheConfigService, DateScalar],
  controllers: [AppController],
})
export class AppModule {}
