import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/infrastructure/nest/modules/transaction.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
