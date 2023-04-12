import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BalancesModule} from "./modules/balances/balances.module";
import {TransactionsModule} from "./modules/transactions/transactions.module";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {MongooseModule} from "@nestjs/mongoose";
import {ClientsModule, Transport} from "@nestjs/microservices";

@Module({
  imports: [
    TransactionsModule,
    BalancesModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: await configService.get('TRANSACTIONS_DB_URI'),
      }),
      inject: [ConfigService],
    }),
    /*
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'transaction-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'transaction-service-consumer',
          }
        }
      }
    ]),
     */
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
