import { join } from 'path';
import { Module } from '@nestjs/common';
import { RetriveController } from './retrieve.controller';
import { RetriveService } from './retrieve.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { TransactionModule } from '../transaction/transaction.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaModule } from 'src/prisma/prisma.module';

const apollloServer = ApolloServerPluginLandingPageLocalDefault();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [apollloServer],
    }),
    ClientsModule.register([
      {
        name: 'any_name_i_want',
        transport: Transport.KAFKA,
        options: {
          subscribe: {
            fromBeginning: true,
          },
          client: {
            clientId: 'transactions-validate',
            brokers: ['kafka:9092'],
          },
        },
      },
    ]),
    PrismaModule,
    TransactionModule,
  ],
  controllers: [RetriveController],
  providers: [RetriveService],
})
export class AppModule {}
