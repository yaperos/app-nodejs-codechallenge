import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { PostModule } from './posts/posts.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { transactionModule } from './transactions/transaction.module';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          }
        }
      }
    ]),
    PostModule,
    transactionModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
