import { join } from 'path'
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TransactionModule } from './transaction/transaction.module';
import { PrismaService } from './prisma/prisma.service';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault({ footer: false })],
    }),
    TransactionModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule { }