import { TransactionsModule } from './modules/transactions/transactions.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from './modules/@config/app-config.module';
import { AppConfigService } from './modules/@config/app-config.service';
@Module({
	imports: [
		TransactionsModule,
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
