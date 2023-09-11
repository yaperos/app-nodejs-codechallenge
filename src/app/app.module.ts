import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { AppService } from './services/app.service';
import { AntiFraudService } from './services/antiFraud.service';
import { AppResolver } from './resolvers/app.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { validationSchema } from '../config/schema.config';
import Config from '../config';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path'
import { CachingModule } from "../app/infraestructure/caching/caching.module";
import { BrokerModule } from "../app/infraestructure/kafka/broker.module";

@Module({
  imports: [
    PrismaModule,
    CachingModule,
    BrokerModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/app/graphql/schema.gql'),
    }),
    ConfigModule.forRoot({
      load: Config,
      isGlobal: true,
      validationSchema
    }),
  ],
  controllers: [AppController, AntiFraudService],
  providers: [AppService, AppResolver],
})
export class AppModule {}