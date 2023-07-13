import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { CustomMongooseModule } from './app/mongo';
import { getEnvironmentVars } from './app/Enviroment';
import { TransactionModule } from './modules/transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [getEnvironmentVars],
    }),
    CustomMongooseModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
