import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandModule } from './commands/command.module';
import { AppResolver } from './app.resolver';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryModule } from './queries/query.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppMiddleware } from './app.middleware';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CommandModule,
    CqrsModule,
    QueryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: 'schema.gql'
    })
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppMiddleware,
    },
    AppService, 
    AppResolver
  ],
})
export class AppModule {}
