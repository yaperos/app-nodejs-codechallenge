import { Environment } from '../enum';
import { MaxPeriods } from './../utils/date.utils';

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			SWAGGER_CONTACT_NAME: string;
			PORT: string | number;
			NODE_ENV: Environment;
			POSTGRES_HOST: string;
			POSTGRES_PORT: string;
			POSTGRES_USER: string;
			POSTGRES_PASS: string;
			POSTGRES_DB: string;
			POSTGRES_SCHEMA: string;
			POSTGRES_SYNCHRONIZE: string;
			POSTGRES_KEEP_CONNECTION_ALIVE: string;
			POSTGRES_LOGGING: string;
			SWAGGER_NAME: string;
			HTTP_TIMEOUT: string;
			SWAGGER_DESCRIPTION: string;
			SWAGGER_VERSION: string;
			SWAGGER_CONTACT_EMAIL: string;
			SWAGGER_CONTACT_URL: string;
			SWAGGER_URL: string;
			GLOBAL_PREFIX: string;
			HTTP_TIMEOUT: string;
			HTTP_MAX_REDIRECT: string;
			GCP_KEY_JSON: string;
			GCP_BUCKET_NAME: string;
			GCP_PROJECT_ID: string;
			LOCAL_DEV_TOKEN: string;
			CARTOLAS_MAX_PERIODS: MaxPeriods;
			CARTOLAS_PARAMETRIA_BASE_URL: string;
			CARTOLAS_PARAMETRIA_SEARCTH_TERM: string;
			CARTOLAS_PUB_SUB_TOPIC_ID: string;
			CARTOLAS_SAMPLES_QUANTITY: string;
			CARTOLAS_SAMPLES_FOLDER: string;
			CARTOLAS_MAILER_BASE_URL: string;
			EMAIL_USER: string;

			// news
			CARTOLAS_YEARS_TO_DELETE: string;
			CRON_VALUE_READ_MESSAGES_PUB_SUB_GCP: string;
			CARTOLAS_GENERATION_QUANTITY: string;
		}
	}
}
