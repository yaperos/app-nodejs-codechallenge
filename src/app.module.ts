import { TransactionsModule } from './modules/transactions/transactions.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './modules/@config/app-config.module';
import { AppConfigService } from './modules/@config/app-config.service';
import { AntiFraudModule } from './modules/anti-fraud/anti-fraud.module';
import { KafkaModule } from './modules/kafka/kafka.module';
@Module({
	imports: [
		AccountsModule,
		TransactionsModule,
		AntiFraudModule,
		KafkaModule,
		MongooseModule.forRootAsync({
			imports: [AppConfigModule],
			inject: [AppConfigService],
			useFactory: (globalService: AppConfigService) => {
				const connectionString = globalService.getConfig.CONNECTION_STRING;
				return {
					uri: connectionString
				};
			},
		})],
	controllers: [AppController],
	providers: [
		AppService
	],
})
export class AppModule { }
