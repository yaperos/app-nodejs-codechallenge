import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService) { }

	getString(key: string): string {
		return this.configService.get<string>(key);
	}

	get getConfig() {
		return {
			NODE_ENV: this.getString('NODE_ENV'),
			CONNECTION_STRING: this.getString('CONNECTION_STRING'),
			KAFKA_CLIENT_ID: this.getString('KAFKA_CLIENT_ID'),
			KAFKA_HOST: this.getString('KAFKA_HOST'),
		};
	}
}
