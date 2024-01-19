import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
  
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),

    TypeOrmModule.forRoot({
      name: 'ConnectionOne',
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'retoDB',
      entities: [Transaction],
      //synchronize: false,
    }),

    TypeOrmModule.forFeature([Transaction], 'ConnectionOne'),

    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'yape-consumer-client',
            brokers: ['localhost:9092'],
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, AppResolver],
})
export class AppModule {}
