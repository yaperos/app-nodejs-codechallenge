import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { GuidAdapter } from '../classes/GuidAdapter.class';

@Injectable()
export class TracingMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
		const traceId = GuidAdapter.create();
		req.headers['x-app-traceid'] = traceId;
		req.headers['x-app-id'] = process.env.APP_PORT;

    next();
  }
}
