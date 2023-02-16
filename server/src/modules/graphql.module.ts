
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { TransactionModule } from './transaction.module';
import { DataLoaderService } from 'src/services/dataloader/dataloader.service';
import { join } from 'path';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
        driver: ApolloDriver,
        imports: [TransactionModule],
        useFactory: (dataloaderService: DataLoaderService) => ({
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          context: () => ({
            loaders: dataloaderService.getAllLoaders(),

          }),
          sortSchema: true,
          debug: true,
          playground: true,
        }),
        inject: [DataLoaderService],
      })
  ]
})

export class GraphQLMod {};