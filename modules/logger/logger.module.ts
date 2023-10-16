import { DynamicModule, Module } from '@nestjs/common';
import { Logger } from './logger.service';
import { CONTEXT } from './constants';

@Module({})
export class LoggerModule {
  static forRoot(context: string): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: CONTEXT,
          useValue: context,
        },
        Logger,
      ],
      exports: [Logger],
    };
  }
}
