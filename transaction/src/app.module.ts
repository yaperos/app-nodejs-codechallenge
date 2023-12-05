import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AntiFraudConsumer } from './antifraud.consumer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KafkaModule } from './kafka/kafka.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
	imports: [TypeOrmModule.forRoot(dataSourceOptions), TransactionModule, KafkaModule],
	controllers: [AppController],
	providers: [AppService, AntiFraudConsumer],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AppModule {}
