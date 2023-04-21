import { Module } from "@nestjs/common";
import { TransactionModule } from "./transaction/transaction.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { join } from "path";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'postgres',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            entities: [join(__dirname, '**', '*.entity.{ts,js}')],
            synchronize: true,
        }),
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
            definitions: {
                path: join(process.cwd(), 'src/graphql.schema.ts'),
            },
            subscriptions: {
                'graphql-ws': true,
            },
        }),
        TransactionModule,
    ],
})
export class DomainModule { }
