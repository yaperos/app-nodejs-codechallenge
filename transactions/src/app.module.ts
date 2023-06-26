import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionsModule } from '@transactions/infrastructure/transactions.module';
import { graphqlConfig } from './shared/config/graphql.config';
import { typeOrmConfig } from './shared/config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    graphqlConfig,
    typeOrmConfig,
    TransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
