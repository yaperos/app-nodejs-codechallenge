import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { UnhandledExceptionBus } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ExceptionBusHandler implements OnModuleDestroy {
  private readonly logger = new Logger(ExceptionBusHandler.name);

  private destroy$ = new Subject<void>();

  constructor(private unhandledExceptionsBus: UnhandledExceptionBus) {
    this.unhandledExceptionsBus
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ exception, cause }) => {
        this.logger.error(
          exception.message,
          exception.stack,
          JSON.stringify(cause),
        );
      });
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
