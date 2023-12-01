import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { TransactionApiModule } from './transaction/module'
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from './validationPipe'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TransferApiModule } from './transfer/module'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        }),
        TransactionApiModule, TransferApiModule],
    providers: [
        {
            provide: APP_PIPE,
            useClass: ValidationPipe,
        }
    ],
})
export class AppModule { }
