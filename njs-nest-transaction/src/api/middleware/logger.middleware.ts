/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const RequestIp = require('@supercharge/request-ip');

class CustomHeaders {
	private headers: { name: string; value: string }[] = [];

	constructor() {
		this.headers = [];
	}

	add(key: string, value: string): void {
		this.headers = [...this.headers, { name: key, value }];
	}

	get(key: string): string {
		const header = this.headers.find((h) => h.name === key);
		return header ? header.value : '';
	}

	has(key: string): boolean {
		return this.headers.some((h) => h.name === key);
	}
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

	use(req: Request, res: Response, next: NextFunction) {
		const ip = RequestIp.getClientIp(res);
		this.logger.info(`Request...${req.method} ${req.url} ${ip}`);
		this.logger.debug(`${getTrxHeader(req.headers)} ${JSON.stringify(req.body)}`);
		next();
	}
}

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
function  getTrxHeader(_headers: Record<string, any>): string {
	const myHeadersSet: CustomHeaders = new CustomHeaders();

	// rome-ignore lint/nursery/noForEach: <explanation>
Object.entries(_headers).forEach(([key, value]) => {
		myHeadersSet.add(key, value);
	});

	const trxHeaderMayus = myHeadersSet.has('User-Agent') ? myHeadersSet.get('User-Agent') : '';
	const trxHeaderMinuscule = myHeadersSet.has('user-agent') ? myHeadersSet.get('user-agent') : '';

	return trxHeaderMayus || String(trxHeaderMinuscule);
}
