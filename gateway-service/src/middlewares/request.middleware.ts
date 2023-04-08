import { Injectable, NestMiddleware } from '@nestjs/common';
import * as crypto from 'crypto';
@Injectable()
export class requestMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: CallableFunction) {
    const uuid = crypto.randomUUID();
    req.body['requestId'] = uuid;
    next();
  }
}
