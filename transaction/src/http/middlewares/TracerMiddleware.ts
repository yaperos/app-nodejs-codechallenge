import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TracerService } from '../../config/tracer/tracer.service';

@Injectable()
export class TracerMiddleware implements NestMiddleware {
  constructor(private tracerService: TracerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.header('x-txref') ) {
      this.tracerService.setTrace(req.header('x-txref')!);
    }

    res.setHeader('x-txref', this.tracerService.getTrace());
    next();
  }
}
