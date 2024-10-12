import { DateAdapter } from "./DateAdapter";

const winston = require('winston');

interface ILogStructure {
	event: string;
	traceId: string;
	message: string;
	data: object;
	createdAt: string;
}

export class AppLoggerAdapter {

	private logger;

	constructor(
		private traceId: string,
		private event: string,
	) {
		this.logger = winston.createLogger({
			level: 'info',
			format: winston.format.json(),
			defaultMeta: { service: process.env.APP_ID },
			transports: [
				new winston.transports.File({ filename: 'application.log' }),
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
			],
		});
	}

	/**
	 * Create a log type INFO
	 * @param message 
	 * @param data 
	 */
	public logInfo (message: string, data: object = {} ) {
		const log: ILogStructure = {
			event: this.event,
			traceId: this.traceId,
			message,
			data,
			createdAt: DateAdapter.nowUTC(),
		};

		this.logger.info(log);
	}

	/**
	 * Create a log type WARNING
	 * @param message 
	 * @param data 
	 */
	public logWarning (message: string, data: object = {} ) {
		const log: ILogStructure = {
			event: this.event,
			traceId: this.traceId,
			message,
			data,
			createdAt: DateAdapter.nowUTC(),
		};

		this.logger.warn(log);
	}

	/**
	 * Create a log type ERROR
	 * @param message 
	 * @param data 
	 */
	public logError (message: string, data: object = {} ) {
		const log: ILogStructure = {
			event: this.event,
			traceId: this.traceId,
			message,
			data,
			createdAt: DateAdapter.nowUTC(),
		};

		this.logger.error(log);
	}
}