import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { isNil } from 'lodash';

@Injectable()
export class AppConfigService {
	constructor(private configService: ConfigService) { }

	getString(key: string): string {
		return this.configService.get<string>(key);
	}

	private getNumber(key: string): number {
		const value = this.get(key);

		try {
			return Number(value);
		} catch {
			throw new Error(key + ' environment variable is not a number');
		}
	}

	get getConfig() {
		return {
			NODE_ENV: this.getString('NODE_ENV'),
			KAFKA_BROKER: this.getString('KAFKA_BROKER'),
			ANTI_FRAUD_THRESHOLD: this.getNumber('ANTI_FRAUD_THRESHOLD')
		};
	}

	private get(key: string): string {
		const value = this.configService.get<string>(key);
	
		if (isNil(value)) {
		  throw new Error(key + ' environment variable is not set'); // probably we should call process.exit() too to avoid locking the service
		}
	
		return value;
	  }
}
