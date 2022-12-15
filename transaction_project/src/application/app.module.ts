import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TransactionRestController } from '../adapter/input/web/transaction.rest.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [TransactionRestController],
  providers: [],
})
export class AppModule {}
