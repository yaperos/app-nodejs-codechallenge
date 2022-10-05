import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Transaction } from './entity/transaction.entity';
import { TransactionStatus } from './entity/transaction_status.entity';
import { TransactionTypes } from './entity/transaction_types.entity';
import { TransactionResolver } from './schema/transaction.resolver';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'TRANSACTION_SERVICE',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'transaction',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'transaction-consumer'
                    }
                }
            },
        ]),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            //debug: false,
           // playground: false,
        }),
        TypeOrmModule.forFeature([Transaction, TransactionTypes, TransactionStatus])
    ],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionResolver],
})
export class TransactionModule { }
