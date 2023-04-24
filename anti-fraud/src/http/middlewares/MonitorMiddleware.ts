import { BadRequestException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TracerService } from '../../config/tracer/tracer.service';

@Injectable()
export class MonitorMiddleware implements NestMiddleware {
  constructor(private tracerService: TracerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
