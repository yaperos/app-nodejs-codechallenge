import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionModule } from './transaction/transaction.module';

@Module({
	imports: [TypeOrmModule.forRoot(dataSourceOptions), TransactionModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
